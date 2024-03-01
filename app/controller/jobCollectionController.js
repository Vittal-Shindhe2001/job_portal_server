const Job = require('../modules/job_collection_model')
const moment = require('moment')
const job_collection_controller = {}

// Create a new job
job_collection_controller.create = async (req, res) => {
    try {
        const body = { ...req.body, company_id: req.body.companyId, userId: req.user.id }

        // Create the job document
        let job = await Job.create(body)
        res.status(201).json({ message: "Job Posted Successfully", job })
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' })
    }
}


// Show a specific job
job_collection_controller.show = async (req, res) => {
    try {
        const { id } = req.params
        const jobs = await Job.findById({ _id: id }).populate({
            path: "userId",
            select: "-password"
        }).populate("company_id")
        res.json(jobs)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// List all jobs
job_collection_controller.list = async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user.id, isDeleted: false }).populate('company_id')

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ error: 'No jobs found for this user' })
        }

        res.json(jobs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// get all jobs
job_collection_controller.jobsList = async (req, res) => {
    try {
        const jobs = await Job.find({ isDeleted: false }).populate('company_id')
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ error: 'No jobs found for this user' })
        }
        res.json(jobs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// Update a job
job_collection_controller.update = async (req, res) => {
    try {
        const {id}=req.params
        const {body}=req
        const updatedJob = await Job.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        if (!updatedJob) {
            return res.status(404).json({ error: 'Job not found' })
        }
        res.json(updatedJob)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// Delete a job
job_collection_controller.destroy = async (req, res) => {
    try {
        const { id } = req.params
        const { isDelete } = req.body

        const deletedJob = await Job.findByIdAndUpdate(id, { isDeleted: isDelete }, { new: true, runValidators: true })
        if (!deletedJob) {
            return res.status(404).json({ error: 'Job not found' })
        }
        res.json(deletedJob)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//job seeker search controller
job_collection_controller.search = async (req, res) => {

    try {
        const { searchTerm } = req.query
        // Create a regex pattern to match case-insensitive search term
        const regexPattern = new RegExp(searchTerm, 'i')

        // Aggregation pipeline to filter jobs based on search term
        const jobs = await Job.aggregate([
            {
                $match: {
                    $or: [
                        { title: { $regex: regexPattern } },
                        { company: { $regex: regexPattern } },
                        { location: { $regex: regexPattern } }
                    ]
                }
            }
        ]).populate({
            path: "userId",
            select: "-password"
        }).populate("company_id")

        res.json(jobs)
    } catch (error) {
        console.error('Error searching jobs:', error)
        res.status(500).json({ error: 'Internal server error' })
    }

}

job_collection_controller.sort = async (req, res) => {

    try {
        const { filter } = req.query
        let jobs = await Job.find()

        if (filter === '1day') {
            jobs = jobs.filter(job => {
                const jobDate = moment(job.posted_at)
                const currentDate = moment()
                const daysDifference = currentDate.diff(jobDate, 'days')
                return daysDifference === 1
            })
        } else if (filter === '1week') {
            jobs = jobs.filter(job => {
                const jobDate = moment(job.posted_at)
                const currentDate = moment()
                const weeksDifference = currentDate.diff(jobDate, 'weeks')
                return weeksDifference === 1
            })
        } else if (filter === '1month') {
            jobs = jobs.filter(job => {
                const jobDate = moment(job.posted_at)
                const currentDate = moment()
                const monthsDifference = currentDate.diff(jobDate, 'months')
                return monthsDifference === 1
            })
        } else {
            // By default, sort by date in descending order
            jobs = jobs.sort((a, b) => moment(b.posted_at).diff(a.posted_at))
        }
        // Populate userId and company_id fields
        await Job.populate(jobs, { path: 'userId', select: '-password' });
        await Job.populate(jobs, 'company_id')
        res.json(jobs)
    } catch (error) {
        console.error('Error getting filtered and sorted jobs:', error)
        res.status(500).json({ message: 'Internal server error', error })
    }
}


module.exports = job_collection_controller