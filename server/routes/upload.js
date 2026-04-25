const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const auth = require('../middleware/auth');

// Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌  Cloudinary credentials missing in .env! Uploads will fail.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to check credentials before upload
const checkCloudinary = (req, res, next) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: 'Cloudinary credentials missing on server. Please check environment variables.' });
  }
  next();
};

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video');
    return {
      folder: 'petverse',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'webp'],
    };
  },
});

const upload = multer({ storage: storage });

// Route to handle single file upload
router.post('/', auth, checkCloudinary, (req, res) => {
  upload.single('file')(req, res, (err) => {
    console.log('📂  Received upload request. File:', req.file);
    if (err) {
      console.error('❌  Upload Middleware Error:', err);
      return res.status(500).json({ message: err.message || 'Error occurred during file upload to Cloudinary' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Return the secure URL to the frontend
      res.json({ 
        url: req.file.path, 
        public_id: req.file.filename,
        resource_type: req.file.mimetype.startsWith('video') ? 'video' : 'image'
      });
    } catch (error) {
      console.error('❌  Upload processing error:', error);
      res.status(500).json({ message: error.message });
    }
  });
});

module.exports = router;
