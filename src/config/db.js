const mongoose = require('mongoose')
const colors = require('colors');

const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const conn = await mongoose.connect(process.env.MONGO_URI_CLOUD, {useNewUrlParser: true})
            console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
        } else {
            const conn = await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
            console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
        }
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

module.exports = connectDB