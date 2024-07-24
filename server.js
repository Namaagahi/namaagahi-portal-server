require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const credentials = require("./middleware/credentials");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect");
const socketToken = require("jwt-then");
const { io, connectedUsers } = require("./config/io");
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use("/", express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/structures", require("./routes/structureRouter"));
app.use("/itAssets", require("./routes/assetRouter"));
app.use("/boxes", require("./routes/boxRoutes"));
app.use("/plans", require("./routes/planRoutes"));
app.use("/initialCustomers", require("./routes/initialCustomerRoute"));
app.use("/finalCustomers", require("./routes/finalCustomersRoutes"));
app.use("/locations", require("./routes/locationRoutes"));
app.use("/projectCodes", require("./routes/projectCodeRoutes"));
app.use("/chatrooms", require("./routes/chatroomRoutes"));
app.use("/messages", require("./routes/messageRouter"));
app.use("/proposals", require("./routes/proposalRoutes"));
app.use("/send-email", require("./routes/sendEmailRoute"));

// Custom 404 page
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html"))
    res.sendFile(path.join(__dirname, "views", "404.html"));
  else if (req.accepts("json")) res.json({ error: "404 Not Found!" });
  else res.type("txt").send("404 Not Found!");
});

// Custom Error handling
app.use(errorHandler);

// Initialize socket.io and attach to server
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

io.attach(server, {
  allowEIO3: false,
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: false,
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await socketToken.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    socket.userId = payload.UserInfo.id;
    connectedUsers[socket.userId] = socket;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Token expired");
      // Emit an event to the client informing about token expiration
      socket.emit("tokenExpired", {
        message: "Token expired, please re-authenticate.",
      });
      // Disconnect the socket
      socket.disconnect(true);
      return next(new Error("Authentication error: Token expired"));
    }
    console.log("ERROR", err);
    next(new Error("Authentication error"));
  }
});

// Handle MongoDB connection events
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
