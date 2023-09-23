const asyncHandler = require('express-async-handler')

const uploadImage = asyncHandler(async(req, res) => {
    console.log(req.body)
    res.send('Image Uploaded!')
})

module.exports = { uploadImage }