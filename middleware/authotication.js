const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    let token = req.header('authorization')
    if (token) {
        token = token.split(' ')[1]
        try {
            const tokenData = jwt.verify(token, process.env.JWT_KEY)
            req.user = {
                id: tokenData.id,
                email:tokenData.email,
                name: tokenData.name,
                role:tokenData.role
            }
            next()
        } catch (error) {
            res.json(error)
        }
    } else {
        res.json({ error: 'token not present' })
    }

}

module.exports = authenticate