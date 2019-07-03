// for profiles

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route     GET api/profile/me --- my profile
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

module.exports = router;