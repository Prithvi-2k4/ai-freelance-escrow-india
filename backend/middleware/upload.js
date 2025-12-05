// backend/middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'worklink/jobs',
    resource_type: 'auto'
  }
});

const parser = multer({ storage });
module.exports = parser;
