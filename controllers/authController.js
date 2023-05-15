const User = require('../model/User')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { username, password } = req.body
    if(!username || !password) return res.status(400).json({ 'msg': 'BAD REQUEST: Username and password are required' })

    // find the requested user
    const foundUser = await User.findOne({ username }).exec()
    if(!foundUser) return res.status(401).json({ 'msg': 'UNAUTHORIZED: Username not found!' }) 

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)
    if(match) {
        const roles = Object.values(foundUser.roles).filter(Boolean)
        const accessToken = JWT.sign(
            { "UserInfo": { "username": foundUser.username, "roles" : roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '300s' }
        )
        const refreshToken = JWT.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        // saving refresh token with current user
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(result)

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None',  maxAge: 24 * 60 * 60 * 1000 }) // add secure: true option for production
        res.json({ roles, accessToken })
    } else {
        res.status(401).json({ 'msg': 'UNAUTHORIZED!' }) 
    }
}

module.exports = { handleLogin }