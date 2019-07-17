// for authentication

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route     GET api/auth ---
// @desc      Test route ---
// @access    Public
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


// @route     POST api/auth ---
// @desc      Authenticate user and get token
// @access    Public
// doesn't need name because its empty at this point
router.post('/', [
        check('email', 'Please include a valid email.').isEmail(),
        check('password', 'Password is required.').exists()
    ],

    // use async -- instead of promises -- then try/catch
    // add await any time you would use .then with promises
    async (req, res) => {
        // console.log(req.body); // logs to back end when sent through postman
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // send error as json
        }

        const { email, password } = req.body; // destructure the body

        try {
            // check if user exists
            // if not, send error
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [ { msg: 'Invalid credentials.' } ] });
            }

            // use bcrypt to compare input password with password from saved info in db
            // this happens if the user does exist in the db
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [ { msg: 'Invalid credentials.' } ] });
            }

            // return jsonwebtoken (logs user in right away)
            // create payload, which has user id
            const payload = {
                user: {
                    id: user.id // created by mongodb, and mongoose removes the underscore
                }
            };

            // change expiresIn to 3600 when in production
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 3600 },
                (err, token) => {
                    if(err) throw err;
                    res.json({ token })
                }
            );
            // res.send('User registered!'); // sends this message back to postman -- for testing
        } catch(err) {
            console.error(err.message)
            res.status(500).send('server error')
        }
    });

module.exports = router;