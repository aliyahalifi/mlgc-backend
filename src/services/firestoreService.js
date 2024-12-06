var admin = require("firebase-admin");
let app;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert(require("./serviceAccountKey.json")),
  });
} else {
  app = admin.app();
}

const db = admin.firestore();

async function storeData(id, data) {
  try {
    const predictCollection = db.collection("predictions");
    await predictCollection.doc(id).set(data);
    console.log(`Document with ID: ${id} stored successfully`);
  } catch (error) {
    console.error("Error storing data to Firestore:", error);
    throw error;
  }
}

module.exports = storeData;
