// for profiles

const express = require('express');
const router = express.Router();

// @route     GET api/profiles ---
// @desc      Test route ---
// @access    Public  --- no token
router.get('/', (req, res) => {
    res.send('Profile route')
});

module.exports = router;