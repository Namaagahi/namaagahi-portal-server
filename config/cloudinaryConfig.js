const cloudinary = require('cloudinary').v2
const multer = require('multer')
const upload = multer({ dest: 'uploads/' });

cloudinary.config({
    cloud_name: 'dd6pt6kpd', 
    api_key: '747662852985963', 
    api_secret: 'P3f1LNwfg2An27CwK0auEUgpjwk'
});

module.exports = cloudinary

