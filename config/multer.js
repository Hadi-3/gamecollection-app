const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'game-collection',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
})

module.exports = multer({ storage: storage})