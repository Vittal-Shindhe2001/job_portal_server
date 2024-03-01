const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job_collection'
    },
    applicant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    company_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    resume: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'view', 'resume download', 'accepted', 'reject'],
        default: 'pending'
    },
    applied_at: {
        type: Date,
        default: Date.now
    }
});

const Application = mongoose.model("Application", applicationSchema)

module.exports = Application