const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
  try {
    const model = await tf.loadGraphModel(
      'https://storage.googleapis.com/mlgc-bucket-aliyah/model.json'
    );
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error.message);
    throw error;
  }
}

module.exports = loadModel;
