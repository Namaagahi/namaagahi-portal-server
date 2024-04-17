const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Route to send emails to users
router.route("/").post((req, res, next) => {
  console.log("Received POST request to /send-email");
  next(); // Call the next middleware or controller function
}, usersController.sendEmailToUsers);

module.exports = router;
