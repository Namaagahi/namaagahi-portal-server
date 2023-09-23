const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const asyncHandler = require('express-async-handler')

const uploadImage = asyncHandler(async(req, res) => {
    
})

// const storage = new GridFsStorage({
//     url: process.env.DATABASE_URI,
//     optionsL: {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     },
//     file: (req, file) => {
//         const match = ["image/png", "image/jpeg"]

//         if(match.indexOf(file.mimetype) === -1) {
//             const filename = `${Date.now()}-any-name-${file.originalname}`
//             return filename
//         }
//         return {
//             bucketName: "photos",
//             filename: `${Date.now()}-any-name-${file.originalname}`
//         }
//     }
// })

// module.exports = multer({storage})