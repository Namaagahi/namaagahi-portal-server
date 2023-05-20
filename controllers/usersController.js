const User = require('../model/User')
const Note = require('../model/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length) return res.status(400).json({message : 'BAD REQUEST : No users found'})
    res.status(200).json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { name, username, password, roles } = req.body

    // Data confirmation
    if(!name || !username || !password || !Array.isArray(roles) || !roles.length ) 
        return res.status(400).json({ message : 'BAD REQUEST : All fields are required' })
    
    // Check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec()
    if(duplicate) return res.status(409).json({ message: 'CONFLICT : This username already exists!' })

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create and store new user
    const userObject = { name, username, "password": hashedPassword, roles}
    const user = await User.create(userObject)
    if(user) res.status(201).json({ message: `CREATED: User ${username} created successfully!` })
    else res.status(400).json({ message: 'BAD REQUEST : Invalid user data recieved' })
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, name, username, roles, password, active, avatar } = req.body

    // Data confirmation
    if(!id || !name || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') 
        return res.status(400).json({ message : 'BAD REQUEST : All fields are required' })
    
    const user = await User.findById(id).exec()
    if(!user) res.status(400).json({ message: 'BAD REQUEST : User not found' })

    // Check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) 
        return res.status(409).json({ message: 'CONFLICT : Duplicate username!' })
    
    // Update and store user
    user.username = username
    user.roles = roles
    user.active = active
    user.name = name
    user.avatar = avatar

    if(password) user.password = await bcrypt.hash(password, 10)
    
    const updatedUser = await user.save()
    res.status(201).json({ message: `${updatedUser.username} updated successfully!` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Data confirmation
    if(!id) return res.status(400).json({ message : 'BAD REQUEST : User id required' })

    const note = await Note.findOne({ user: id }).lean().exec()
    if(note) return res.status(400).json({ message: 'BAD REQUEST : User has assigned notes'})

    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({ message: 'BAD REQUEST : User not found' })

    const deletedUser = await user.deleteOne()
    const reply = `Username ${deletedUser.username} with ID ${deletedUser.id} deleted successfully!`
    res.status(200).json(reply)
})

// @desc Get a user
// @route GET /users
// @access Private
const getUser = asyncHandler(async (req, res) => {
    const thisUser = await User.findOne({ _id: req.params.id }).exec()
    if(!thisUser) return res.status(204).json({ message: `NO CONTENT: User ID ${req.params.id} not found` })
    res.status(200).json(thisUser)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
}