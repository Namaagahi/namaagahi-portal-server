const mongoose = require('mongoose')

const structureSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        duration:{
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
                required: true
            }
        },
        kind: {
            type: String,
            required: true
        },
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
        style: {
            type: String,
            required: true
        },
        face: {
            type: String,
            required: true
        },
        dimensions: {
            type: String,
            required: true
        },
        printSize: {
            type: Number,
            required: true
        },
        docSize: {
            type: Number,
            required: true
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

// noteSchema.plugin(AutoIncrement, {
//     inc_field: 'ticket',
//     id: 'ticketNums',
//     start_seq: 500
// })

module.exports = mongoose.model('Structure', structureSchema)