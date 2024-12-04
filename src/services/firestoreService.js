const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

const COLLECTION_NAME = 'predictions';

const savePrediction = async (data) => {
    const docRef = firestore.collection(COLLECTION_NAME).doc(data.id);
    await docRef.set(data);
};

const getPredictions = async () => {
    const snapshot = await firestore.collection(COLLECTION_NAME).get();
    const predictions = [];
    snapshot.forEach((doc) => predictions.push({ id: doc.id, history: doc.data() }));
    return predictions;
};

module.exports = { savePrediction, getPredictions };
