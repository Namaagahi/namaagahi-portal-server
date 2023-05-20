const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://s8.uupload.ir/files/profile-fallback_qieo.png'
    },
    roles: [{
        type: String,
        default: "Planner"
    }],
    active: {
        type: Boolean,
        default: true
    },

    refreshToken: [String]
})

module.exports = mongoose.model('User', userSchema)