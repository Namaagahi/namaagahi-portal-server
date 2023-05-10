const User = require('../model/User')
const bcrypt = require('bcrypt')

const handleNewUser = async(req, res) => {
    const { username, password } = req.body
    if(!username || !password) return res.status(400).json({ 'msg': 'BAD REQUEST: Username and password are required' })

    // check for duplicate usernames in db
    const duplicate = await User.findOne({ username }).exec()
    if(duplicate) return res.status(409).json({ 'msg': 'CONFLICT: This username already exists!' })

    try {
        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 10)
        // create and store the new user
        const result = await User.create({ 
            "username": username,
            "password": hashedPassword
        })
        console.log(result)
        
        res.status(201).json({ 'msg': `CREATED: User ${username} created successfully!` })
    } catch (error)  {
        res.status(500).json({ 'msg': `INTERNAL SERVER ERROR: ${error.message}` })
    }
}

module.exports = { handleNewUser }