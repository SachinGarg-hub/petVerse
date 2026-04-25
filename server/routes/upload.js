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
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('📂 Processing upload for:', req.file.originalname, req.file.mimetype);

    // Upload to Cloudinary using stream
    const isVideo = req.file.mimetype.startsWith('video');
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'petverse',
        resource_type: isVideo ? 'video' : 'image',
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary Upload Error:', error);
          return res.status(500).json({ message: 'Cloudinary upload failed', error });
        }
        
        console.log('✅ Cloudinary Upload Success:', result.secure_url);
        res.json({ 
          url: result.secure_url, 
          public_id: result.public_id,
          resource_type: result.resource_type
        });
      }
    );

    // Send the buffer to Cloudinary
    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error('❌ Upload processing error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
