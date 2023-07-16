const mongoose = require('mongoose')
const Schema = mongoose.Schema

const planSchema = new Schema({
        planId: {
            type: String,
            required: true,
            default: `plan_${new Date().getTime() + String(Math.random()).replace('.', '').slice(0, 6)}`
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
        customerName: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'InitialCustomer'
        },
        structures: [{
            structureId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Structure'
            },
        }]
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)

module.exports = mongoose.model('Plan', planSchema)