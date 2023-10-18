require('dotenv').config()
const express = require('express')
const app = express() 
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger, logEvents } = require('./middleware/logEvents')
const errorHandler  = require('./middleware/errorHandler')
const credentials = require('./middleware/credentials')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConnect')
const PORT = process.env.PORT || 3500
const socketToken = require("jwt-then")
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
const Message = require('./model/Message')
const User = require('./model/User')

const io = require("socket.io")(server, {
  allowEIO3: false,
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: false
  }
})

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token
    const payload = await socketToken.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log("payload", payload)
    socket.userId = payload.UserInfo.id
    next()
  } catch (err) {
    console.log("ERROR", err)
  }
})

io.on("connection", (socket) => {
  console.log("SOCKET USERID", socket.userId)

  console.log("Connected: " + socket.userId)

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId)
  })

  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId)
  })

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
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

// connect to MongoDB
connectDB()

// set limit
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))

// custom logger middleware
app.use(logger)

// handle options credentials check before CORS and fetch cookies credentials requirement
app.use(credentials)

// using cors options for managing request and sharing the server
app.use((cors(corsOptions)))

// built-in middleware to handle urlencoded data (form data)
app.use(express.urlencoded({ extended: false }))

// built-in middleware to handle json
app.use(express.json())

// middleware for cookies 
app.use(cookieParser())

// serve static files
app.use('/', express.static(path.join(__dirname, 'public')))

// routes
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))
app.use('/structures', require('./routes/structureRouter'))
app.use('/boxes', require('./routes/boxRoutes'))
app.use('/plans', require('./routes/planRoutes'))
app.use('/initialCustomers', require('./routes/initialCustomerRoute'))
app.use('/finalCustomers', require('./routes/finalCustomersRoutes'))
app.use('/locations', require('./routes/locationRoutes'))
app.use('/projectCodes', require('./routes/projectCodeRoutes'))
app.use('/chatrooms', require('./routes/chatroomRoutes'))
app.use('/tickets', require('./routes/ticketRoutes'))

// Custom 404 page
app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')) res.sendFile(path.join(__dirname, 'views', '404.html'))
    else if(req.accepts('json')) res.json({error: "404 Not Found!"})
    else res.type('txt').send("404 Not Found!")
})

// Custom Error handling
app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    server
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})