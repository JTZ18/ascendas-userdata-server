const express = require('express');
const router = express.Router();
const { getBookings, setBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');
const User = require('../models/userModel');
const passport = require('passport');

require('../config/passport')


router.get('/', passport.authenticate('jwt', { session: false }), getBookings);
router.post('/', passport.authenticate('jwt', { session: false }), setBooking);
router.put('/:booking_reference', passport.authenticate('jwt', { session: false }), updateBooking);
router.delete('/:booking_reference', passport.authenticate('jwt', { session: false }), deleteBooking);

module.exports = router