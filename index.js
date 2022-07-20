//jshint esversion:6
const path = require('path');
require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require('express-session');
const passport = require('passport')
const connectDB = require('./src/config/db')
const MongoStore = require('connect-mongo')
const axios = require('axios')
const port = process.env.PORT || 3000;


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
    res.send("welcome to user service API")
})

//TODO: to get ready for deployment  
// Serve frontend
// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../frontend/build')))

//     app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html')))
// } else {
//     app.get('/', (req, res) => res.send('Please env variable set to production'))
// }

app.listen(port, function() {
    console.log(`Server started on port ${port}`)
})