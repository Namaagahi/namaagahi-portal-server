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
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('initialCustomer', initialCustomerSchema)