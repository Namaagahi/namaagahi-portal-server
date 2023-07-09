require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger, logEvents } = require('./middleware/logEvents')
const errorHandler  = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/virifyJWT')
const credentials = require('./middleware/credentials')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConnect')
const PORT = process.env.PORT || 3500

// connect to MongoDB
connectDB()

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
// app.use('/refresh', require('./routes/api/refresh'))
// app.use('/logout', require('./routes/api/logout'))
app.use(verifyJWT)
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))
app.use('/structures', require('./routes/structureRouter'))
app.use('/boxes', require('./routes/boxRoutes'))
app.use('/locations', require('./routes/locationRoutes'))

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
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})