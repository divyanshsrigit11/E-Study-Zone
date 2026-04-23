const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure with your Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ==========================================
// 1. PROFILE PICTURE STORAGE (Images Only)
// ==========================================
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'E-Study-Zone/Profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        // Automatically resize massive photos so they load fast on the frontend!
        transformation: [{ width: 500, height: 500, crop: 'limit' }] 
    },
});

// ==========================================
// 2. COURSE CONTENT STORAGE (Images + PDFs)
// ==========================================
const contentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'E-Study-Zone/Course-Content',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
        resource_type: 'auto', // CRITICAL: Tells Cloudinary to accept raw documents like PDFs
    },
});

// Export both uploaders so your routes can pick which one to use!
const uploadProfile = multer({ storage: profileStorage });
const uploadContent = multer({ storage: contentStorage });

module.exports = { uploadProfile, uploadContent };