const mongoose = require('mongoose')
const Schema = mongoose.Schema

const packageSchema = new Schema({
    boxName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    sysCode: {
        type: Number,
        required: true
    },
    structureType: {
        type: String,
        required: true
    },
    faceType: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    dimensions: {
        type: Number,
        required: true
    },
    printSize: {
        type: Number,
        required: true
    },
    currentSize: {
        type: Number,
        required: true
    },
    pricePerMeter: {
        type: Number,
        required: true
    },
    buyMonthlyFee: {
        type: Number,
        required: true
    },
    maintenance: {
        type: Number,
        required: true
    },
    monthlyColoring: {
        type: Number,
        required: true
    },
    electrical: {
        type: Number,
        required: true
    },
    sellMonthlyFee: {
        type: Number,
        required: true
    },
    constantDailyFee: {
        type: Number,
        required: true
    },
    startDate: {
        type: Number,
        required: true
    },
    endDay: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Package', packageSchema)