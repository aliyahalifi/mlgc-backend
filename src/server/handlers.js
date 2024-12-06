const getHistories = require("../services/getHistories");
const predictClassification = require("../services/inferenceService");
const storeData = require("../services/firestoreService");
const crypto = require("crypto");

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { label } = await predictClassification(model, image);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    
    const data = {
        "id": id,
        "result": label,
        "suggestion": label == 'Cancer' ? 'Segera hubungi dokter' : 'Penyakit kanker tidak terdeteksi.',
        "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
    })
    response.code(201);
    return response;
}

async function getHistoriesHandler(_request, h) {
    try {
        const histories = await getHistories();
    
        return h.response({
          status: 'success',
          data: histories,
        }).code(200);
      } catch (error) {
        console.error('Error in getHistoriesHandler:', error.message);
        return h.response({
          status: 'fail',
          message: 'Failed to fetch histories',
        }).code(500);
      }
    }

module.exports = {postPredictHandler, getHistoriesHandler};