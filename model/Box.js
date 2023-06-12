const mongoose = require('mongoose')
const Schema = mongoose.Schema

const boxSchema = new Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        type: {
            name: {
                type: String,
                required: true  
            },
            typeOptions: {
                projectNumber: {
                    type: String,
                    required: false
                },
                brand: {
                    type: String,
                    required: false
                }
            }
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
        structureIds: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Structure'
        }]
    }
,
    {
        timestamps: true
    }
) 

module.exports = mongoose.model('Box', boxSchema)