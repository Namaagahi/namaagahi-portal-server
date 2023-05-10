const User = require('../model/User')
const JWT = require('jsonwebtoken')

const handleRefreshToken = async(req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(401).json({ 'msg': 'UNAUTHORIZED: Cookies or jwt was not found' })
    const refreshToken = cookies.jwt

    // find the requested user
    const foundUser = await User.findOne({ refreshToken }).exec()
    if(!foundUser) return res.status(403).json({ 'msg': 'FORBIDDEN: no refresh token found!' }) 

    // evaluate JWT
    JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username) return res.status(403)
            const roles = Object.values(foundUser.roles)
            const accessToken = JWT.sign(
                { "UserInfo": { "username": foundUser.username, "roles" : roles } },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            )
            
            res.json({ accessToken })
        }
    )
}

module.exports = { handleRefreshToken }