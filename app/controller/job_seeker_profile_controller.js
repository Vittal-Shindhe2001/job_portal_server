const JobSeekerProfile = require('../modules/job_seeker_profile_model')
const UserModel = require('../modules/user_model')

const jobSeekerProfileController = {}

jobSeekerProfileController.update = async (req, res) => {
    try {
        const { phone, address, education, experience, skills,firstName, lastName, email } = req.body
        const resumePath = req.file.path // Path to the uploaded resume file
        // Find the user
        const user = await UserModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Update user details
        if (firstName !== undefined) user.firstName = firstName
        if (lastName !== undefined) user.lastName = lastName
        if (email !== undefined) user.email = email

        await user.save()
        // Check if the user has an existing profile
        let profile = await JobSeekerProfile.findOne({ userId: user._id })

        if (!profile) {
            // If no existing profile found, create a new one
            profile = new JobSeekerProfile({
                phone,
                address,
                education,
                experience,
                skills,
                resume: resumePath,
                userId: user._id
            })

            await profile.save()
        } else {
            // If an existing profile is found, update it
            profile.phone = phone
            profile.address = address
            profile.education = education
            profile.experience = experience
            profile.skills = skills
            profile.resume = resumePath

            await profile.save()
        }

        // Populate user data (if needed)
        await profile.populate({
            path: 'userId',
            select: '-password' // Exclude password field
        })
        return res.status(200).json({ message: 'Profile updated successfully', result: profile })
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error })
    }
}
module.exports = jobSeekerProfileController
