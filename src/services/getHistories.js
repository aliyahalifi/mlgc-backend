const admin = require("firebase-admin");
let app;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert(require("./serviceAccountKey.json")),
  });
} else {
  app = admin.app();
}

const db = admin.firestore();

async function getHistories() {
  try {
    const snapshot = await db.collection("predictions").get();
    if (snapshot.empty) {
      console.log("No histories found in Firestore.");
      return [];
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      history: doc.data(),
    }));

    console.log("Histories retrieved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error getting histories:", error);
    throw error;
  }
}

module.exports = getHistories;