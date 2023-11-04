const mongoose = require('mongoose')
const Schema = mongoose.Schema

const initialCustomerSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    agentName: {
      type: String,
      required: false
    },
    role: {
      type: String,
      required: false
    },
    phoneNumber: {
      type: Number,
      required: false
    },
    introductionMethod: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('initialCustomer', initialCustomerSchema)
