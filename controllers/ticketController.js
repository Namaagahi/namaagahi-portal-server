const Ticket = require('../model/Ticket')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')
const { io, connectedUsers } = require('../config/io')

// @desc Get all tickets
// @route GET /ticket
// @access Private
const getAllTickets = asyncHandler(async (req, res) => {

  const tickets = await Ticket.find().lean()
  if (!tickets?.length)
    return res.status(400).json({ message: 'BAD REQUEST: No tickets found' })

  const ticketWithUser = await Promise.all(
    tickets.map(async (ticket) => {
      const user = await User.findById(ticket.userId).lean().exec()
      return { ...ticket, username: user.username }
    })
  )

  res.json(ticketWithUser)
})

// @desc Create a new ticket
// @route POST /ticket
// @access Private
const createTicket = asyncHandler(async (req, res) => {

  const { userId, subject, initialCustomerId, startDate, endDate, priority, status, type, description, assignedUsers } = req.body

  // Create the ticket
 try {

  if (!subject || !startDate || !endDate || !priority || !type || !assignedUsers) {
    return res.status(400).json({
      success: false,
      message: 'Bad Request: Required fields are missing.'
    })
  }

  const duplicate = await Ticket.findOne({ subject }).lean().exec()
  if (duplicate)
    return res.status(409).json({
      success: false,
      message: 'CONFLICT :Duplicate ticket subject'
    })

  const ticket = new Ticket({
    userId,
    subject,
    initialCustomerId,
    startDate,
    endDate,
    priority,
    status,
    type,
    description,
    assignedUsers,
  })

  const savedTicket = await ticket.save()
  const ticketAssignedUsers = savedTicket.assignedUsers

  res.status(200).json({
    success: true,
    message: `CREATED: Ticket ${req.body.subject} created successfully!`
  })

  ticketAssignedUsers.forEach((userId) => {
    const userSocket = connectedUsers[userId]
    if (userSocket) {
      userSocket.emit('newTicket', { ticket: savedTicket })
    }
  })

 } catch (error) {
  console.log("TICKET/POST ERR", error)
  res.status(500).json({
    success: false,
    message: 'Internal Server Error: Failed to create a ticket.'
  })
 }
})

// @desc Update a ticket
// @route PUT /ticket/:id
// @access Private
// const updateTicket = asyncHandler(async (req, res) => {

//   const ticketId = req.params.id
//   const { subject, startDate, endDate, priority, status, type, description, assignedUsers } = req.body

//   // Update the ticket
//   const updatedTicket = await Ticket.findByIdAndUpdate(
//     ticketId,
//     {
//       subject,
//       startDate,
//       endDate,
//       priority,
//       status,
//       type,
//       description,
//       assignedUsers,
//     },
//     { new: true }
//   )

//   // Emit a Socket.io event to notify assigned users
//   assignedUsers.forEach((userId) => {
//     io.getIO().to(userId).emit('ticketUpdated', updatedTicket)
//   })

//   res.status(200).json(updatedTicket)
// })

module.exports = {
  getAllTickets,
  createTicket,
}
