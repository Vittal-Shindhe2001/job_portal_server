const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    companyName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['jobseeker', 'employer', 'admin'],
        required: true
    }
}, { timetamps: true })

const UserModel = mongoose.model("UserModel", Schema)

module.exports = UserModel