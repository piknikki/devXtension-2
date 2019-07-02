const mongoose = require('mongoose'); // import mongoose
const config = require('config'); // use the config package
const db = config.get('mongoURI'); // use db to get mongoURI from default.json (connection string from mongo atlas)

  // use mongoose to connect to db, returns a promise
const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true });

        console.log('mongoDB connected...')
    } catch(err) {
        console.error(err.message); // to show error and exit process
        process.exit(1); // exit with failure
    }
}

module.exports = connectDB;