const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport')
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { compareSync, hashSync } = require('bcrypt');


// @desc     Google sign up / sign in
// @ route   GET /api/users/auth/google
// @ access  Public
const googleOauth = asyncHandler(passport.authenticate("google", { scope: ['profile'] }))


// @desc     handle successful login from Google account
// @ route   GET /api/users/auth/google/callback
// @ access  Public
const googleOauthCallback = asyncHandler(async (req, res) => {
    // TODO: Implement google oauth callback
    // generate JWT access and refresh tokens using req.user data
    //asyncHandler(await passport.authenticate('google', { failureRedirect: '/' })) 
    // findOrCreate user in DB via googleId
    console.log(req.user)
    // send JWT access and refresh tokens and user profile to front end
    // redirect user back to front end page (is this possible?)
    res.status(200).json({ message: 'Google oauth callback: WIP' })
    res.redirect('https://journeyside.web.app/')
})


// @desc     takes in a refresh token to generate a new access token for user
// @ route   GET /api/users/token-refresh
// @ access  Public
const tokenRefresh = asyncHandler(async (req, res) => {
    // TODO: Implement token refresh feature
    // takes in a JWT refresh token
    let token
    token = req.cookies.jwt

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'You have no refresh token to get an access token' 
        })
    }
    // decode the refresh token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    // check if the refresh token is valid
    const user = await User.findById(decoded.id).select('-password')
    // if valid, take user ID and generate a new access token
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User does not exist in DB'
        })
    }
    // return new access token to front end
    const payload = {
        username: user.username,
        id: user._id
    }
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
    res.status(200).json({ 
        success: true,
        message: 'Successfully generated new access token',
        token: "Bearer " + accessToken
    })
})



// @desc     Register new user
// @ route   POST /api/users/register
// @ access  Public
const registerUser = asyncHandler(async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(401).json({
            success: false,
            message: 'Please fill up username and password'
        })
    }
    const userExists = await User.findOne({ username: req.body.username }).select('-password')
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' })
    }

    // Create new user
    const newUser = await User.create({
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    })

    if (!newUser) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: err
        })
    }

    const payload = {
        username: newUser.username,
        id: newUser._id
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24, secure: true, SameSite: 'None'  })
    return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user_id: newUser._id,
        username: newUser.username,
        token: "Bearer " + accessToken
    })

})


// @desc    Authenticate a user
// @ route POST /api/users/login
// @ access Public
const loginUser = asyncHandler( async(req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(401).json({
            success: false,
            message: 'Please fill up username and password'
        })
    }
    const user = await User.findOne({ username: req.body.username })
    //no  user found
    if(!user) {
        return res.status(400).json({ message: "Could not find user" })
    }

    //wrong password
    if (!compareSync(req.body.password, user.password)) {
        return res.status(400).json({ message: "Wrong password" })
    }

    const payload = {
        username: user.username,
        id: user._id
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24, secure: true, SameSite: 'None' })
    return res.status(200).send({
        success: true,
        message: "Logged in successfully",
        token: "Bearer " + accessToken
    })

})

// @desc     Get user data
// @ route   GET /api/users/me
// @ access  Private
const getMe = asyncHandler(async (req, res) => {
    const userObj = await User.findById(req.user.id).select('-password')

    res.status(200).send({
        success: true,
        message: "User data retrieved successfully",
        user: userObj
    })
})

const logout = asyncHandler(async (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.status(400).json({ message: "Logged out" })
      });
})


module.exports = { registerUser, loginUser, googleOauth, getMe, logout, googleOauthCallback, tokenRefresh }