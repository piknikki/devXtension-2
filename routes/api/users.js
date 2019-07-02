// registering, adding users
// bring in routes

const express = require('express');
const router = express.Router();

// @route     GET api/users ---
// @desc      Test route ---
// @access    Public  --- no token
router.get('/', (req, res) => {
    res.send('User route')
});

// post route for new users

module.exports = router;
