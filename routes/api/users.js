const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // add /check to end

// post route for new users
// @route     POST api/users
// @desc      Register user
// @access    Public  --- (no token)
// add second paramter (array) as middleware, checking isEmail and isLength
router.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email.').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    (req, res) => {
    // console.log(req.body); // logs to back end when sent through postman
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // send error as json
        }
    res.send('User route'); // sends this message back to postman
});




module.exports = router;
