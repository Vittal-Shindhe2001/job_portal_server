const Company = require("../modules/companies_model")
const mongoose=require('mongoose')
const companyController = {}

companyController.create = async (req, res) => {
    try {
        const { body } = req
        // Create the company with the user ID from the token
        const company = await Company.create({ ...body, created_by: req.user.id })
       
        // Populate additional information about the user
        await company.populate({
            path: 'created_by',
            select: '-password' // Exclude the password field
        })
        console.log(company);
        res.json({ message: "Company created successfully", company })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
}
companyController.employerCompanyDtls=async(req,res)=>{
    try {
        const result=await Company.aggregate([
            {
                $match: {
                    created_by: new mongoose.Types.ObjectId(req.user.id)
                }
            }
        ])
        if (result.length>0) {
            res.json(result)
        }else{
            res.json({message:"No Company Found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

// Controller function to list all companies
companyController.list = async (req, res) => {
    try {
        const companies = await Company.find()
        res.json(companies)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// Controller function to show a specific company
companyController.show = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)
        if (!company) {
            return res.status(404).json({ error: 'Company not found' })
        }
        res.json(company)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// Controller function to update a company
companyController.update = async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updatedCompany) {
            return res.status(404).json({ error: 'Company not found' })
        }
        res.json(updatedCompany)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// Controller function to delete a company
companyController.destroy = async (req, res) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(req.params.id)
        if (!deletedCompany) {
            return res.status(404).json({ error: 'Company not found' })
        }
        res.json({ message: 'Company deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = companyController