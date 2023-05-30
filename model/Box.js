const mongoose = require('mongoose')
const Schema = mongoose.Schema

const boxSchema = new Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        boxName: {
            type: String,
            required: true
        },
        boxType: {
            type: String, 
            required: true
        },
        projectNumber: {
            type: Number,
            required: false
        },
        brand: {
            type: String,
            required: false
        },
        startDate: {
            type: Date,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        }, 
        plans: {
            type: Array,
            required: false
        },
        billboards: {
            type: Array,
            required: false
        }
    }
,
    {
        timestamps: true
    }
) 

module.exports = mongoose.model('Box', boxSchema)