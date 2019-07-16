const express = require('express'); // import express

// import db connection from db.js
const connectDB = require('./config/db');

const path = require('path');

const app = express();  // use express as app

// connect database from above
connectDB();

// Init middleware for body parsing
app.use(express.json({ extended: false }))


// define routes, to use routes in ./routes/api
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', index.html))
    });
}

app.listen(process.env.PORT || 5000, () => console.log("server started on port process.env or 5000"));  // listen to port