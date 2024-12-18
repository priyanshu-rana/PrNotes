const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const { serviceAccount } = require("../config/serviceAccount");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

const generateSignedUrl = async (req, res) => {
  try {
    const { fileName, contentType } = req.body;

    const uniqueFileName = `attachments/${fileName}-${uuidv4()}`;
    const file = bucket.file(uniqueFileName);

    const options = {
      version: "v4",
      action: "write",
      expires: Date.now() + 2 * 60 * 1000, // expires in 2min/120000ms
      contentType,
    };

    const [url] = await file.getSignedUrl(options);
    res.status(200).json({ url, path: uniqueFileName });
  } catch (error) {
    console.error("Error generating signed URL", error);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
};

module.exports = { generateSignedUrl };
