const { compareSync } = require('bcrypt');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel')
const Booking = require('../models/bookingModel')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy


var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    //console.log(jwt_payload)

    // find user in db
    User.findOne({ _id: jwt_payload.id }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}))
console.log(process.env.NODE_ENV)
console.log(process.env.GOOGLE_CALLBACK_URL_DEV)
// configuring passport google strategy
if(process.env.NODE_ENV === 'production') {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL_PROD // to change callback url, must change on google cloud project as well
    },
    function(accessToken, refreshToken, profile, cb) {
        //console.log(profile)
        User.findOrCreate({ googleId: profile.id, username: profile.email }, function (err, user) {
        return cb(err, user);
        });
    }
    ));
} else {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL_DEV // to change callback url, must change on google cloud project as well
    },
    function(accessToken, refreshToken, profile, email, cb) {
        User.findOrCreate({ googleId: profile.id, username: email }, function (err, user) {
        return cb(err, user);
        });
    }
    ));
}

// passport needs to serialise and deserialise users, mongoose passport plugin helps with that ONLY FOR LOCAL STRATEGY
passport.use(User.createStrategy())

//Persists user data inside session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//Fetches session details using session id
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
