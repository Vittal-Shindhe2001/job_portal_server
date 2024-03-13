const mongoose = require('mongoose')


const job_collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String], // Square brackets indicate an array
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    posted_at: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const Job_collection = mongoose.model("Job_collection", job_collectionSchema)

module.exports = Job_collection