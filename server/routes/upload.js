const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('☁️  Cloudinary Config Check:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
  api_key: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing',
});

// Middleware to check credentials
const checkCloudinary = (req, res, next) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: 'Cloudinary credentials missing on server. Please check environment variables.' });
  }
  next();
};

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Route to handle single file upload
router.post('/', auth, checkCloudinary, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('📂 Uploading file:', req.file.originalname, 'Size:', req.file.size);

    // Convert buffer to base64 Data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const isVideo = req.file.mimetype.startsWith('video');

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'petverse',
      resource_type: isVideo ? 'video' : 'image',
    });

    console.log('✅ Cloudinary Success:', result.secure_url);
    
    res.json({ 
      url: result.secure_url, 
      public_id: result.public_id,
      resource_type: result.resource_type
    });

  } catch (error) {
    console.error('❌ Upload Route Crash:', error);
    res.status(500).json({ 
      message: error.message || 'Upload failed', 
      detail: error 
    });
  }
});

module.exports = router;
