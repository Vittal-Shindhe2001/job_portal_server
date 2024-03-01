const mongoose = require('mongoose');

// Define schema for job seeker profile
const JobSeekerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    experience: {
        type: String
    },
    skills: [
        {
            type: String,
            required: true
        }
    ],

}, { timestamps: true });


const JobSeekerProfile = mongoose.model('JobSeekerProfile', JobSeekerProfileSchema);
module.exports = JobSeekerProfile;
