const { Server } = require('socket.io')
const io = new Server()
const Message = require('../model/Message')
const User = require('../model/User')


const Socket = {
  emit: function (event, data) {
      console.log(event, data)
      io.sockets.emit(event, data)
  }
}

const connectedUsers = {}

io.on("connection", (socket) => {

  // socket.on("disconnect", () => {
  //   console.log("Disconnected: " + socket.userId)
  // })

  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId)
    console.log("A user joined chatroom: " + chatroomId)
  })

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId)
    console.log("A user left chatroom: " + chatroomId)
  })

  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId })
      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        message,
      })

      io.to(chatroomId).emit("newMessage", {
        message,
        name: user.name,
        userId: socket.userId,
      })
      await newMessage.save()
    }
  })
})

exports.Socket = Socket
exports.io = io
exports.connectedUsers = connectedUsers
