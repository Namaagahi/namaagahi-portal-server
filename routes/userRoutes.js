const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const upload = require('../config/multerConfig')

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(upload.single("image"), usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router