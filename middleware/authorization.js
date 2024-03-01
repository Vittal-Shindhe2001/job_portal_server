const authorize = (req, res, next) => {
    if (req.permittedRoles.includes(req.user.role)) {
        next()
    } else {
        res.status(403).json({ error: "You are not previlaged to access this route" })
    }
}

module.exports=authorize