const mongoose = require('mongoose')
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    description: {
        type: String
    },
    industry: {
        type: String,
        required:true
    },
    size: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String,
        required:true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }

});

const Company = mongoose.model("Company", companySchema)
module.exports=Company