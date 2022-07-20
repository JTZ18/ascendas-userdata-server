const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    refreshToken: { 
        type: String 
    }
},
{
    timestamps: true,
})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)
//userSchema.plugin(encrypt, {secret: process.env.AES_SECRET, encryptedFields: ["username"]})

module.exports = mongoose.model('User', userSchema); 
