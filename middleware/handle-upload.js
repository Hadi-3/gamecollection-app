const upload = require('../config/multer')

const uploadImage = (req, res, next) => {
    const singleUpload = upload.single('image');

    singleUpload(req, res, function (err) {
        if (err) {
            console.error('MULTER ERROR:', err);
            req.fileUploadError = err.message || 'Upload failed';
        }
        next();
    });
};

module.exports = uploadImage;