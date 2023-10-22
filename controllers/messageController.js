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

module.exports = {
    getAllMessages,

}
// const getAllMessages = asyncHandler(async (req, res) => {

//     const skip = req.query.skip ? Number(req.query.skip) : 0
//     const DEFAULT_LIMIT = 2
// console.log("skip", skip)
//     const messages = await Message.find().skip(skip).limit(DEFAULT_LIMIT).lean()
//     if (!messages?.length) 
//         return res.status(400).json({ message: 'BAD REQUEST : No messages found' })

//     const messagesWithUser = await Promise.all(messages.map(async (message) => {
//         const user = await User.findById(message.user).lean().exec()
//         return { ...message, username: user.name }
//     }))

//     res.json(messagesWithUser)
// })

// module.exports = {
//     getAllMessages,
// }
