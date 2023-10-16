const express = require('express')
const router = express.Router()
const chatroomController = require('../controllers/chatroomController')

router.route('/')
    .get(chatroomController.getAllChatrooms)
    .post(chatroomController.createNewChatroom)
    .delete(chatroomController.deleteChatroom)

module.exports = router