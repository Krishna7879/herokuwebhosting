const userData = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const verifyuser = jwt.verify(token,'secret')
        const user= await userData.findOne({_id: verifyuser._id})

        req.user=user
        req.token=token
        // req.token=token
        next()
    }
    catch (err) {
        return res.redirect('/login')
    }
}
module.exports=auth