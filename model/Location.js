const mongoose = require('mongoose')
const Schema = mongoose.Schema

const locationSchema = new Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        structureId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Structure'
        },
        locationX: {
            type: Number,
            required: true,
        },
        locationY: {
            type: Number,
            required: true,
        },
        same: {
            type: String,
            required: false,
        },
        selected: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Location', locationSchema)
