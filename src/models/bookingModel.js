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

    payee_information: {
        payment_id: { type: String },
        payee_id: { type: String },
    },

    guest_information: {
        salutation: { type: String },
        first_name: { type: String },
        last_name: { type: String },
    },

    destination_id: { type: String },
    hotel_id: { type: String },
    price : { type: String },
    supplier_booking_id: { type: String },
    booking_reference: { type: String },

    supplier_booking_response: {
        cost: { type: String },
        down_stream_booking_reference: { type: String },
        booking_terms_and_conditions: { type: String },
        hotel_terms_and_conditions: { type: String }
    },

    booking_display_information: {
        number_of_nights: { type: Number },
        start_date: { type: String },
        end_date: { type: String },
        adults: { type: Number },
        children: { type: Number },
        message_to_hotel: { type: String },
        room_types: { type: Array },
    }
}, {
    timestamps: true,
})

bookingSchema.plugin(passportLocalMongoose)
bookingSchema.plugin(findOrCreate)

// secret key: encrypting data with AES
bookingSchema.plugin(encrypt, {secret: process.env.AES_SECRET, encryptedFields: ["payee_information", "guest_information", "destination_id", "hotel_id", "price", "supplier_booking_id", "supplier_booking_response", "booking_display_information"]})

module.exports = mongoose.model('Booking', bookingSchema);