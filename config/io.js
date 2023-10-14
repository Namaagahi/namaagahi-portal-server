const { Server } = require('socket.io')
const httpServer = require('./http-server') // Replace with your HTTP server setup

let io

const initializeSocketIO = () => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {
    console.log('Socket.io: User connected')

    // Handle socket events here as needed
    // Example: socket.on('disconnect', () => {})
  })
}

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized')
  }
  return io
}

module.exports = {
  initializeSocketIO,
  getIO,
}