const mongoose = require('mongoose')
const Schema = mongoose.Schema

const planSchema = new Schema({
    planNo: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    sysCode: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    printSize: {
        type: Number,
        required: true
    },
    sellMonthlyFee: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    feeAfterDiscount: {
        type: Number,
        required: true
    },
    sellDaycount: {
        type: Number,
        required: true
    },
    packagePrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Plan', planSchema)
