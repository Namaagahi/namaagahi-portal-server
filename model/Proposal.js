const mongoose = require('mongoose')

const proposalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  subject: {
    type: String,
    required: true,
  },
  initialCustomerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'InitialCustomer'
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
  assignedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }]
})

const Proposal = mongoose.model('Proposal', proposalSchema)

module.exports = Proposal
