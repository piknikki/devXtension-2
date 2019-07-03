const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator'); // add /check to end
const User = require('../../models/User'); // import the user

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

    // use async -- instead of promises -- then try/catch
    // add await any time you would use .then with promises
    async (req, res) => {
    // console.log(req.body); // logs to back end when sent through postman
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // send error as json
        }

        const { name, email, password } = req.body; // destructure the body

        try {
            // check if user exists
            // if so, send error because cannot have more than one user with same name/login
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [ { msg: 'User already exists' } ] })
            }

            // get user's gravatar -- pass user's email into method with options
            // s = size, r = rating, d = default image for if user doesn't have a gravatar
            const avatar = gravatar.url(email, {
                s: 200,
                r: 'pg',
                d: 'mm'
            })

            // create instance of new user
            user = new User({
                name,
                email,
                avatar,
                password
            });

            // encrypt password -- salt first with 10 rounds
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save(); // saves user

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
                { expiresIn: 360000 },
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
