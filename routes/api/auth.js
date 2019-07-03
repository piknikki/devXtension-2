// for authentication

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route     GET api/auth ---
// @desc      Test route ---
// @access    Public  --- no token
router.get('/', auth, async (req, res) => { // route is protected when auth is used as a 2nd param in the get route
    // res.send('Auth route')

    try {
        const user = await User.findById(req.user.id).select('-password'); // leaves off password from grabbing the user id
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

module.exports = router;