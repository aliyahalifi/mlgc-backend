const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // Import multer
const routes = require('./routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Multer setup untuk upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Menyimpan dengan nama unik
    },
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        status: 'fail',
        message: err.message || 'Internal Server Error',
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
