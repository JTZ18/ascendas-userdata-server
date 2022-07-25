const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate')
const Booking = require('../models/bookingModel')
const User = require('../models/userModel')

// @desc    Get bookings
// @route   GET /api/bookings
// @access  Private

const getBookings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')
    const bookings = await Booking.find( {user: user} )
    res.status(200).json({
        bookings
    })
})
 
// @desc    Set booking
// @route   POST /api/bookings
// @access  Private

const setBooking = asyncHandler(async (req, res) => {
    const bookingInfo = req.body
    bookingInfo.user = req.user.id
    if (!req.body) {
        res.status(400)
        throw new Error('Please add json file')
    }

    const booking = await Booking.create(bookingInfo)
    const response = {
        success: true,
        message: 'Booking created successfully',
        booking: booking
    }
    res.status(200).json(response)
})


// @desc    Update booking via booking_reference id, update whole object
// @route   PUT /api/bookings/:booking_reference
// @access  Private

const updateBooking = asyncHandler(async (req, res) => {
    const updatedBookingInfo = req.body
    updatedBookingInfo.user = req.user.id
    console.log(updatedBookingInfo)

    const booking = await Booking.findOne({ booking_reference: req.params.booking_reference })

    if (!booking) {
        res.status(400)
        throw new Error('Booking not found')
    }

    const user = await User.findById(req.user.id)

    // Check for user 
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the booking user
    if (booking.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }
    console.log(booking._id)

    // const updatedBooking = await Booking.findByIdAndUpdate(booking._id, updatedBookingInfo,
    //     {
    //         new: true,
    //     })

    // Delete the booking
    await Booking.findByIdAndDelete(booking._id)

    // Create a new booking
    const newBooking = await Booking.create(updatedBookingInfo)
    const response = {
        success: true,
        message: 'Booking created successfully',
        booking: newBooking
    }
    res.status(200).json(response)
})


// @desc    Delete booking via booking_reference id
// @route   DELETE /api/bookings/:booking_reference
// @access  Private

const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({ booking_reference: req.params.booking_reference })

    if(!booking) {
        res.status(400)
        throw new Error('Booking not found')
    }

    const user = await User.findById(req.user.id)

    // Check for user 
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the booking user
    if (booking.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }


    await Booking.findOneAndDelete({ booking_reference: req.params.booking_reference })

    res.status(200).json({
        success: true,
        message: `Delete Booking: ${req.params.booking_reference}`,
    })
})

module.exports = {
    getBookings,
    setBooking,
    updateBooking,
    deleteBooking,
}