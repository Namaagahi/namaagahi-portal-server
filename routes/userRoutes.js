const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const multer = require("multer");
const upload = multer({ dest: "/uploads/" });

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(upload.single("avatar"), usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);
// router.route("/send-email").post((req, res, next) => {
//   console.log("Received POST request to /send-email");
//   next(); // Call the next middleware or controller function
// }, usersController.sendEmailToUsers);
module.exports = router;
