//jshint esversion:6
require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require('express-session');
const passport = require('passport')
const connectDB = require('./src/config/db')
const MongoStore = require('connect-mongo')
const axios = require('axios')


const app = express()
const cors = require('cors');

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors({origin: true}))


// setup to use passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    //store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: "sessions" }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

require('./src/config/passport');
app.use(passport.initialize())
app.use(passport.session())

connectDB()


app.use('/api/users', require('./src/routes/userRoutes'))
app.use('/api/bookings', require('./src/routes/bookingRoutes'))

app.get("/", function(req, res) {
    res.redirect("https://google.com")
    res.send("welcome to user service API")
})

app.listen(3000, function() {
    console.log("Server started on port 3000")
})