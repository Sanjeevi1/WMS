const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/request_photos'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/request-photo', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ filePath: `/uploads/request_photos/${req.file.filename}` });
});

module.exports = router; 