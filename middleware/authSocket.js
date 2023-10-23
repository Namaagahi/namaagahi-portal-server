const jwt = require("jwt-then")

const authSocket = (socket, next) => {
  const token = socket.handshake.query?.token
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
    socket.user = decoded
  } catch (err) {
    return next(new Error("NOT AUTHORIZED"))
  }
  next()
}

module.exports = authSocket