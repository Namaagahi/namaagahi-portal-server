const mongoose = require("mongoose")
const Schema = mongoose.Schema

const chatroomSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: "Name is required!",
    },
  },
  { timestamps: true }
) 

module.exports = mongoose.model("Chatroom", chatroomSchema)