const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate')
const encrypt = require('mongoose-encryption');

const bookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    salutation: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    phone: {type: String},
    email: {type: String},
    specialReq: {type: String},
    cardNum: {type: String},
    address: {type: String},
    bookingCreateDate: {type: Number},
    bookingKey: {type: String},
    cancellation: {type: Boolean},
    location: {type: String},
    locationId: {type: String},
    checkIn: {type: Number},
    checkOut: {type: Number},
    adults: {type: Number},
    children: {type: Number},
    rooms: {type: String},
    nights: {type: Number},
    hotelId: {type: String},
    hotelName: {type: String},
    hotelAddr: {type: String},
    hotelPrice: {type: Number},
    hotelFreeCancel: {type: Boolean},
    hotelBreakfast: {type: Boolean},
    supplierId: {type: String},   
    supplierBookingId  : {type: String},
    supplierResponse: {
        cost: {type: String},
        down_stream_booking_reference: {type: String},
        booking_terms_and_conditions: {type: String},
        hotel_terms_and_conditions: {type: String}
    }
}, {
    timestamps: true,
})

bookingSchema.plugin(passportLocalMongoose)
bookingSchema.plugin(findOrCreate)

// secret key: encrypting data with AES
bookingSchema.plugin(encrypt, { secret: process.env.AES_SECRET, encryptedFields: ["phone", "email", "number", "address", "cardNum"] })

module.exports = mongoose.model('Booking', bookingSchema);