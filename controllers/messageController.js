const Message = require('../model/Message')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')

// @desc Get all messages 
// @route GET /messages
// @access Private
const getAllMessages = asyncHandler(async (req, res) => {

    const page = req.query.page || 0
    const messagesPerPage = 5
    const direction = req.query.direction || 'older'
    const sortDirection = direction === 'newer' ? -1 : 1

    const messages = await Message
        .find()
        .lean()
        .sort({ createdAt: sortDirection })
        .skip(page * messagesPerPage)
        .limit(messagesPerPage)

    if (!messages?.length) 
        return res.status(400).json({ message: 'BAD REQUEST : No messages found' })

    const messagesWithUser = await Promise.all(messages.map(async (message) => {
        const user = await User.findById(message.user).lean().exec()
        return { ...message, username: user.name }
    }))

    res.json(messagesWithUser)
})

// @desc Delete all messages in a chatroom
// @route DELETE /chatrooms/:chatroomId/messages
// @access Private

const deleteChatroomMessages = asyncHandler(async (req, res) => {

    const { chatroomId } = req.body
  
    const deleteResult = await Message.deleteMany({ chatroom: chatroomId });
  
    if (deleteResult.deletedCount > 0) {
      return res.json({ message: `Deleted ${deleteResult.deletedCount} messages in the chatroom.` })
    } else {
      return res.status(404).json({ message: 'No messages found in the chatroom.' })
    }
  })

module.exports = {
    getAllMessages,
    deleteChatroomMessages
}
