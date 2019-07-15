// for profiles

const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route     GET api/profile/me
// @desc      get current user profile
// @access    Private --- need middleware, add as second param into route
router.get('/me', auth, async (req, res) => {
    // res.send('Profile route') --- test route

    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }

        // if there is a profile, send as a json
        res.json(profile);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
});


// @route     POST api/profile
// @desc      create or update user profile
// @access    Private --- need middleware, add as second param into route
router.post('/',
    [auth, [
        check('status', 'Status is required')
            .not()
            .isEmpty(),
        check('skills', 'Skills is required')
            .not()
            .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // destructured
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // build profile object
        const profileFields = {};
        profileFields.user = req.user.id; // gets this from the token that was sent
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {profileFields.skills = skills.split(', ').map(skill => skill.trim())
        }

        // build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.user.id }); // the id comes in from the token

            if (profile) {
                //update -- set profile fields as new input to save, tell it that it's new
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                    );

                //  return the whole profile
                return res.json(profile);
            }

            //  Create a profile if not already created (which would be caught in the block above)
            profile = new Profile(profileFields);

            await profile.save(); // save into the db
            res.json(profile); // send back the profile as a json

        } catch (err) {
            console.log(err.message);
            res.status(500).send('server error')
        }
 });


// @route     GET api/profile
// @desc      get all profiles
// @access    Public
router.get("/", async (req, res) => {
    try {
        // populate from the user collection, add array of name and avatar
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);

    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


// @route     GET api/profile/user/:user_id
// @desc      get profile by user id
// @access    Public
// when there's a colon in the route, use params instead of body or other
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });
        res.json(profile);
    } catch (error) {
        console.error(err.message);

        // check for error where there is no such id number
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error')
    }
});

// @route     DELETE api/profile
// @desc      delete profile, user, & posts
// @access    Private
router.delete("/", auth, async (req, res) => {
    try {
        // remove posts
        await Post.deleteMany({ user: req.user.id });
        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User deleted' });

    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route     PUT api/profile/experience
// @desc      add experience to the profile
// @access    Private
// will have a form on react, and title and company will both be required, so need to put them
//    into the auth array to make sure they're required
router.put("/experience",
    [auth, [
        check('title', 'Title is required')
            .not()
            .isEmpty(),
        check('company', 'Company is required')
            .not()
            .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);  // validation results
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // destructuring to pull out of req.body
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        // create an object out of hte data the user submits
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            // get the profile we're adding to
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp); // use unshift to put this at the beginning

            await profile.save(); // save it

            res.json(profile); // return whole profile

        } catch (error) {
            console.error(err.message);
            res.status(500).send('server error')
        }
});

// @route     DELETE api/profile/experience/:exp_id -- could be put, but since removing data, make it a delete
// @desc      delete specific experience from the profile
// @access    Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        // get the profile of the user
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).send('no profile found');
        }

        // get index of what needs to be removed
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        // once we hve the index, use it in splice to remove that experience from the profile
        profile.experience.splice(removeIndex, 1);

        // save the profile and return whole profile again.
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }
});


// @route     PUT api/profile/education
// @desc      add education to the profile
// @access    Private
router.put("/education",
    [auth, [
        check('school', 'school is required')
            .not()
            .isEmpty(),
        check('degree', 'degree is required')
            .not()
            .isEmpty(),
        check('fieldofstudy', 'field of study is required')
            .not()
            .isEmpty()
    ]
    ],
    async (req, res) => {
        const errors = validationResult(req);  // validation results
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // destructuring to pull out of req.body
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        // create an object out of hte data the user submits
        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            // get the profile we're adding to
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu); // use unshift to put this at the beginning

            await profile.save(); // save it

            res.json(profile); // return whole profile

        } catch (error) {
            console.error(err.message);
            res.status(500).send('server error')
        }
    });

// @route     DELETE api/profile/education/:edu_id -- could be put, but since removing data, make it a delete
// @desc      delete specific education from the profile
// @access    Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        // get the profile of the user
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).send('no profile found');
        }

        // get index of what needs to be removed
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

        // once we hve the index, use it in splice to remove that education from the profile
        profile.education.splice(removeIndex, 1);

        // save the profile and return whole profile again.
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')

    }
});

// @route     GET api/profile/github/:username
// @desc      get user repos from GitHub
// @access    Public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&
            client_id=${config.get('githubClientId')}&
            client_secret=${config.get("githubClientSecret")}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No GitHub profile found' })
            }

            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')

    }
});



module.exports = router;