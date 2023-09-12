const mongoose = require('mongoose')
const Schema = mongoose.Schema

const finalCustomerSchema = new Schema({
        finalCustomerId: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        contractType: {
            type: String,
            enum: ['official', 'unofficial'],
            required: true
        },
        customerType: {
            type: String,
            enum: ['legal', 'personal'],
            required: true
        },
        agent: [{
            agentName: {
                type: String
            },
            post: {
                type: String
            }
        }],
        nationalId: {
            type: Number,
            required: true
        },
        ecoCode: {
            type: Number
        },
        regNum: {
            type: Number
        },
        address: {
            type: String
        },
        postalCode: {
            type: Number
        },
        phone: {
            type: Number
        },
        planIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan'
        }],
        // projectCodes: [{
        //     year: {
        //         type: Number,
        //         required: false
        //     },
        //     code: {
        //         type: String,
        //         required: false
        //     }
        // }]
    },
    { timestamps: true }
)

module.exports = mongoose.model('finalCustomer', finalCustomerSchema)