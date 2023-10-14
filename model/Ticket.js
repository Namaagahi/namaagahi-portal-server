const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  startDate: {
    type: Number,
    required: true,
  },
  endDate: {
    type: Number,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  status: {
    type: String,
    enum: ['in-progress', 'done'],
    default: 'in-progress',
  },
  type: {
    type: String,
    enum: ['billboard', 'metro', 'bus', 'namava'],
    required: true,
  },
  description: {
    type: String,
  },
  assignedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  attachments: [
    {
      filename: String,
      filePath: String,
    },
  ],
})

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket