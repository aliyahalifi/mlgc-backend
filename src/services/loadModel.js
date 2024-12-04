const tf = require('@tensorflow/tfjs-node');
const { Storage } = require('@google-cloud/storage');

const BUCKET_NAME = 'mlgc-bucket';
const MODEL_PATH = 'model/model.json';

const loadModelFromBucket = async () => {
    const storage = new Storage();
    const [files] = await storage.bucket(BUCKET_NAME).getFiles({ prefix: 'model/' });
    const model = await tf.loadLayersModel(`gs://${BUCKET_NAME}/${MODEL_PATH}`);
    return model;
};

module.exports = { loadModelFromBucket };
