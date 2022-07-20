const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleOauth, getMe, logout, googleOauthCallback, tokenRefresh } = require('../controllers/userController');
const User = require('../models/userModel');
const passport = require('passport');

require('../config/passport')


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get("/auth/google", googleOauth)
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleOauthCallback
);
router.get('/token-refresh', tokenRefresh) // TODO: token refresh feature
router.get("/me", passport.authenticate('jwt', { session: false }), getMe)
router.get("/logout", logout)

module.exports = router