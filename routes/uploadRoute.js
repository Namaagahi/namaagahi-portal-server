const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/uploadController')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router.route('/')
    .post(uploadController.uploadImage, upload.single('image'))

module.exports = router