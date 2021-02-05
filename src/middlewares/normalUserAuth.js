const User = require('../models/user')

const normalUserAuth = (req, res, next) => {
    if(req.user.isAdmin) {
        res.status(401).send({ error: 'You are not allowed for such action' })
    }
    next()
}
module.exports = normalUserAuth