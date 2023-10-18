const Chatroom = require('../model/Chatroom')
const User = require('../model/User')
const asyncHandler = require('express-async-handler')

// @desc Get all chatrooms
// @route GET /chatrooms
// @access Private
const getAllChatrooms = asyncHandler(async (req, res) => {

    const chatrooms = await Chatroom.find().lean()
    if (!chatrooms?.length) 
        return res.status(400).json({ message: 'BAD REQUEST : No chatrooms found' })

    const chatroomsWithUser = await Promise.all(chatrooms.map(async (chatroom) => {
        const user = await User.findById(chatroom.userId).lean().exec()
        return { ...chatroom, username: user.username }
    }))

    res.json(chatroomsWithUser)
})

// @desc Create new chatroom
// @route POST /chatrooms
// @access Private
const createNewChatroom = async (req, res) => {

    const {
        userId,
        name
    } = req.body

    if (!userId || !name) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })

    const chatroomExists = await Chatroom.findOne({ userId, name })
    if (chatroomExists) 
        return res.status(409).json({ message: 'CONFLICT : This chatroom already exists!' })

    const chatroom = await Chatroom.create({ userId, name })
    if(chatroom)
        return res.status(201).json({ message: `CREATED: Chatroom ${name} created successfully!` })
}

// @desc Delete a chatroom
// @route DELETE /chatrooms
// @access Private
const deleteChatroom = asyncHandler(async (req, res) => {

    const { id } = req.body
    if(!id) 
        return res.status(400).json({ message : 'BAD REQUEST : Chatroom id required' })

    const chatroom = await Chatroom.findById(id).exec()
    if(!chatroom) 
        return res.status(400).json({ message: 'BAD REQUEST : Chatroom not found' })

    const deletedChatroom = await chatroom.deleteOne()
    const reply = `Chatroom ${deletedChatroom.name} with ID ${deletedChatroom.id} deleted successfully!`
    res.status(200).json(reply)
})

module.exports = { getAllChatrooms, createNewChatroom, deleteChatroom }
