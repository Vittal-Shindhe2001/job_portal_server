const Application = require('../modules/application_model')
const Company = require('../modules/companies_model')
const JobSeekerProfile = require('../modules/job_seeker_profile_model')
require('dotenv').config()

const applictionController = {}

// Create a new application
applictionController.create = async (req, res) => {
    try {
        const resumePath = req.file?.path ? req.file.path : req.body.resume;
        const { applicant_id, company_Id, job_id, phone } = req.body;
        const formData = {
            applicant_id,
            company_Id,
            job_id,
            phone,
            resume: resumePath
        }
        const application = await Application.create(formData)
        res.status(201).json(application)
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
    }
}

// List user all applications
applictionController.list = async (req, res) => {
    try {
        const applications = await Application.find({ applicant_id: req.user.id })
            .populate('job_id').populate('company_Id')
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
// List employes application
applictionController.employesJobApplication = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const companies = await Company.find({ created_by: req.user.id });

        let applications = []
        let totalCount = 0
        if (companies) {
            for (const company of companies) {
                const result = await Application.find({ company_Id: company._id })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('company_Id')
                    .populate({
                        path: 'applicant_id',
                        select: '-password'
                    })
                    .populate('job_id')

                applications = applications.concat(result); // Concatenate the results into `applications`
            }
            // Perform a separate query to count the total number of documents
            totalCount = await Application.countDocuments({ company_Id: { $in: companies.map(company => company._id) } });
        }
        res.json({ applications, totalCount });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



// Show a specific application
applictionController.show = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//admin all application
applictionController.allApplicationList = async (req, res) => {
    try {
        const applications = await Application.find()
        res.json(applications)
    } catch (error) {
        res.json(error)
    }
}

// Update an application
applictionController.update = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const updatedApplication = await Application.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!updatedApplication) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//find application on id employer
applictionController.showId = async (req, res) => {
    try {
        const { id } = req.params
        const application = await Application.findById(id).populate('company_Id')
            .populate({
                path: 'applicant_id',
                select: '-password'
            })
            .populate('job_id')

        let applicant_profile
        if (application) {
            applicant_profile = await JobSeekerProfile.findOne({ userId: application.applicant_id._id })
        }
        const concatenatedResponse = {
            application: application,
            applicant_profile: applicant_profile
        }
        res.json(concatenatedResponse)
    } catch (error) {
        res.json(error)
    }
}
// Delete an application
applictionController.destroy = async (req, res) => {
    try {
        const deletedApplication = await Application.findByIdAndDelete(req.params.id);
        if (!deletedApplication) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = applictionController