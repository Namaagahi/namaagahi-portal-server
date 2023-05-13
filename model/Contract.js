const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contractSchema = new Schema({
    boxName: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Contract', contractSchema)
