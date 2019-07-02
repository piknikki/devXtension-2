const express = require('express'); // import express

// import db connection from db.js
const connectDB = require('./config/db');

const app = express();  // use express as app

// connect database from above
connectDB();

app.get("/", (req, res) => {
    res.send("API running"); // puts the message in the window
})

const PORT = process.env.PORT || 5000;  // find port in the env file as PORT or use 5000

app.listen(PORT, () => console.log(`server started on port ${PORT}`));  // listen to port