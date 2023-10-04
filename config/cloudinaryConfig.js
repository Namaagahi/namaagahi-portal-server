const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: 'dd6pt6kpd', 
    api_key: '747662852985963', 
    api_secret: 'P3f1LNwfg2An27CwK0auEUgpjwk'
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'avatars', 
      allowed_formats: ['jpg', 'jpeg', 'png'] 
    }
  })

module.exports = { cloudinary, storage }

