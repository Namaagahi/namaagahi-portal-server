const Ticket = require('../model/Ticket')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')

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
  const { subject, startDate, endDate, priority, status, type, description, assignedUsers, attachments } = req.body

  // Create the ticket
  const ticket = new Ticket({
    subject,
    startDate,
    endDate,
    priority,
    status,
    type,
    description,
    assignedUsers,
    attachments,
  })

  const savedTicket = await ticket.save()

  // Emit a Socket.io event to notify assigned users
  assignedUsers.forEach((userId) => {
    io.getIO().to(userId).emit('ticketCreated', savedTicket)
  })

  res.status(201).json(savedTicket)
})

// @desc Update a ticket
// @route PUT /ticket/:id
// @access Private
const updateTicket = asyncHandler(async (req, res) => {
  const ticketId = req.params.id
  const { subject, startDate, endDate, priority, status, type, description, assignedUsers, attachments } = req.body

  // Update the ticket
  const updatedTicket = await Ticket.findByIdAndUpdate(
    ticketId,
    {
      subject,
      startDate,
      endDate,
      priority,
      status,
      type,
      description,
      assignedUsers,
      attachments,
    },
    { new: true }
  )

  // Emit a Socket.io event to notify assigned users
  assignedUsers.forEach((userId) => {
    io.getIO().to(userId).emit('ticketUpdated', updatedTicket)
  })

  res.status(200).json(updatedTicket)
})

module.exports = {
  getAllTickets,
  createTicket,
  updateTicket,
}