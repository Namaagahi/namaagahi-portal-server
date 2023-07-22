const mongoose = require('mongoose')
const moment = require('moment-jalaali')
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
        brand: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: 'suggested'
        },
        structures: [{
            structureId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Structure'
            },
            discountFee: {
                type: String,
                required: true
            },
            discountType: {
                type: String,
                required: true
            },
            monthlyFee: {
                type: Number,
                required: true
            },
            monthlyFeeWithDiscount: {
                type: Number,
                required: true
            },
            duration: {
                sellStart: {
                    type: String,
                    required: true,
                },
                sellEnd: {
                    type: String,
                    required: true,
                },
                diff: {
                    type: Number,
                    required: false,
                    default: function() {
                        return moment(this.duration.sellEnd, 'jYYYY-jMM-jDD').diff(moment(this.duration.sellStart, 'jYYYY-jMM-jDD'), 'days') + 1
                    }
                }
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