const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
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
        default: 'https://drive.google.com/file/d/1pimt-vh4uvErhnTmg5wk6rNcGk7KP_vG/view?usp=share_link'
    },
    roles: {
        Planner: {
            type: Number,
            default: 1002
        },
        MediaManager: Number,
        Admin: Number
    },

    refreshToken: String
})

module.exports = mongoose.model('User', userSchema)