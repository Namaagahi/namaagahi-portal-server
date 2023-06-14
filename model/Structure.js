const mongoose = require('mongoose')
const Schema = mongoose.Schema

const structureSchema = new Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true,
        },
        location: {
            district: {
                type: Number,
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
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Structure', structureSchema)
