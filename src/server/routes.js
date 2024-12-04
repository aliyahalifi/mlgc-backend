const express = require('express');
const { predictHandler, historyHandler } = require('./handlers');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Routes
router.post('/predict', upload.single('image'), predictHandler);
router.get('/predict/histories', historyHandler);

module.exports = router;
