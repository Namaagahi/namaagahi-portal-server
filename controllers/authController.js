const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req, res) => {
    const { user, password } = req.body
    if(!user || !password) return res.status(400).json({ 'msg': 'Username and password are required' })

    // find the requested user
    const foundUser = usersDB.users.find(person => person.username === user)
    if(!foundUser) return res.status(401).json({ 'msg': 'Username not found!' }) 

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)
    if(match) {
        const roles = Object.values(foundUser.roles)
        const accessToken = JWT.sign(
            { "UserInfo": { "username": foundUser.username, "roles" : roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        )
        const refreshToken = JWT.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        // saving refresh token with current user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = { ...foundUser, refreshToken }
        usersDB.setUsers([...otherUsers, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None',  maxAge: 24 * 60 * 60 * 1000 }) // add secure: true option for production
        res.json({ accessToken })
    } else {
        res.status(401).json({ 'msg': 'Unauthorized!' }) 
    }
}

module.exports = { handleLogin }