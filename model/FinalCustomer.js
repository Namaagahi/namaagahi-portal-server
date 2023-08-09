const mongoose = require('mongoose')
const Schema = mongoose.Schema

const finalCustomerSchema = new Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        agentName: {
            type: String,
            required: false
        },
        companyName: {
            type: String,
            required: true
        },
        post: {
            type: String,
            required: false,
            default: 'نماینده'
        },
        ecoCode: {
            type: Number,
            required: false
        },
        regNum: {
            type: Number,
            required: false
        },
        nationalId: {
            type: Number,
            required: false
        },
        address: {
            type: String,
            required: false
        },
        phone: {
            type: Number,
            required: false
        },
        postalCode: {
            type: Number,
            required: false
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('finalCustomer', finalCustomerSchema)