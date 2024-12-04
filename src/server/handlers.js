const { inferSkinCancer } = require('../services/inferenceService');
const { savePrediction, getPredictions } = require('../services/firestoreService');

const predictHandler = async (req, res, next) => {
    try {
        if (!req.files || !req.files.image) {
            throw new Error('Image file is required');
        }

        const image = req.files.image;

        if (image.size > 1000000) {
            return res.status(413).json({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            });
        }

        const result = await inferSkinCancer(image);
        const suggestion =
            result === 'Cancer'
                ? 'Segera periksa ke dokter!'
                : 'Penyakit kanker tidak terdeteksi.';
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const createdAt = new Date().toISOString();

        const prediction = { id, result, suggestion, createdAt };
        await savePrediction(prediction);

        res.status(200).json({
            status: 'success',
            message: 'Model is predicted successfully',
            data: prediction,
        });
    } catch (error) {
        next(error);
    }
};

const historyHandler = async (req, res, next) => {
    try {
        const histories = await getPredictions();
        res.status(200).json({
            status: 'success',
            data: histories,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { predictHandler, historyHandler };
