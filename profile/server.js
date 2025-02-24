const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: './uploads/avatars',
    filename: function(req, file, cb) {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Profile update endpoint
app.post('/api/profile/update', async (req, res) => {
    try {
        // Here you would update the user profile in your database
        // Example with MongoDB:
        // await User.findByIdAndUpdate(userId, req.body);
        
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// Avatar upload endpoint
app.post('/api/profile/avatar', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Here you would update the user's avatar path in your database
        // const avatarPath = req.file.path;
        // await User.findByIdAndUpdate(userId, { avatar: avatarPath });

        res.status(200).json({ message: 'Avatar uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading avatar' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));