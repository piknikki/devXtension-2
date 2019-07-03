// build a schema for the user with mongoose
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

// export with 2 params: what to call a single user and the schema to use to build a new user
module.exports = User = mongoose.model('user', UserSchema);