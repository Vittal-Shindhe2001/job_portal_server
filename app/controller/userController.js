const UserModel = require('../modules/user_model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JobSeekerProfile = require('../modules/job_seeker_profile_model')
require('dotenv').config()

const userController = {}

userController.regist = async (req, res) => {
    try {
        const { body } = req
        //gen salt value
        const salt = await bcrypt.genSalt()
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(body.password, salt)
        // Replace the plain text password with the hashed one
        body.password = hashedPassword
        if (body) {
            const result = await UserModel.aggregate([
                {
                    $match: { email: body.email }
                },
                {
                    $limit: 1 // Limit the result to 1 document
                }
            ])
            if (result.length > 0) {
                return res.status(200).json({ message: 'Email alredy exist' })
            } else {
                // Create user record with hashed password
                const result = await UserModel.create(body)
                return res.status(200).json({ message: 'User created successfully', result })
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
userController.login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await UserModel.findOne({ email })

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'Invalid email or password' })
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        // Generate token
        const tokenData = {
            id: user._id,
            email: user.email,
            name: user.firstName,
            role: user.role

        }
        const token = jwt.sign(tokenData, process.env.JWT_KEY)

        // Send token in response
        res.json({ token: `Bearer ${token}` })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//user Info
userController.info = async (req, res) => {
    try {
        // Find the user
        const user = await UserModel.findOne({ _id: req.user.id });
        // Create a new array of users with password removed
        const { password, ...userWithoutPassword } = user.toObject()

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        } else if (user) {

        }

        // Find the job seeker profile associated with the user
        const jobSeekerProfile = await JobSeekerProfile.findOne({ userId: req.user.id });

        // Combine user data with job seeker profile data
        const userData = {
            user: userWithoutPassword
        }
        if (jobSeekerProfile) {
            userData.profile = jobSeekerProfile;
        }
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
}

//List User Info
userController.list = async (req, res) => {
    try {

        const users = await UserModel.find()

        // Create a new array of users with password removed
        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPassword } = user.toObject()
            return userWithoutPassword
        })
        res.json(usersWithoutPassword)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


userController.distroy = async (req, res) => {
    try {
        const { body } = req
        const result = await UserModel.findByIdAndUpdate({ email: body })
    } catch (error) {

    }
}

module.exports = userController