const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, res, next) {
    // get token from header
    const token = req.header('x-auth-token');

    // check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    // verify token
    try {
        // decode salted token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // user comes from the payload, can then use in any of the protected routes
        req.user = decoded.user;
        next();

    } catch(err) {
        return res.status(401).json({ msg: 'token is not valid' })
    }
}