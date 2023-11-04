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
