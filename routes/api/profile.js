// for profiles

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

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



module.exports = router;