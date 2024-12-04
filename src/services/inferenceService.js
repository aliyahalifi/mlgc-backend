const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');  // TensorFlow.js untuk inferensi model
const storage = new Storage();
const bucketName = 'mlgc-bucket';  
const modelFileName = 'models/model.json';  

// Fungsi untuk mengunduh model dari GCS dan memuatnya ke TensorFlow.js
const loadModelFromGCS = async () => {
  const tempFilePath = path.join(__dirname, 'temp_model');
  
  // Download model dari GCS ke direktori sementara
  const options = {
    destination: tempFilePath,
  };
  
  await storage.bucket(bucketName).file(modelFileName).download(options);
  console.log(`Model downloaded to ${tempFilePath}`);
  
  // Memuat model menggunakan TensorFlow.js
  const model = await tf.loadLayersModel(`file://${tempFilePath}`);
  console.log('Model loaded successfully');
  
  // Hapus file sementara setelah dimuat
  fs.unlinkSync(tempFilePath);
  
  return model;
};

// Fungsi untuk melakukan inferensi menggunakan model yang sudah dimuat
const inferSkinCancer = async (image) => {
  try {
    // Muat model dari GCS
    const model = await loadModelFromGCS();
    
    // Lakukan pre-processing pada image (misalnya resize, normalisasi, dll.)
    const imageTensor = tf.node.decodeImage(image.data);  // Misalnya image.data adalah buffer gambar
    const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);  // Sesuaikan ukuran sesuai kebutuhan
    const normalizedImage = resizedImage.div(tf.scalar(255.0));  // Normalisasi gambar jika diperlukan

    // Lakukan inferensi
    const prediction = model.predict(normalizedImage.expandDims(0));
    const result = prediction.argMax(-1).dataSync()[0];  // Misalnya argMax untuk klasifikasi

    // Hasil inferensi
    return result === 0 ? 'Cancer' : 'No Cancer';  // Sesuaikan logika dengan kelas model Anda
  } catch (error) {
    console.error('Error during inference:', error);
    throw new Error('Inference failed');
  }
};

module.exports = { inferSkinCancer };
