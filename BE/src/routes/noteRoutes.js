const express = require("express");
const multer = require("multer");
const auth = require("../middlewares/auth");
const admin = require("firebase-admin");
const firebaseConfig = require("../../firebase.conf");
// const serviceAccount = require("../../");
// firebase-adminsdk-mbuer@prnotes-7c669.iam.gserviceaccount.com

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const noteRouter = express.Router();
const storage = multer.memoryStorage();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(firebaseConfig)),
  // credential: admin.credential.cert(credentials),

  storageBucket: "gs://prnotes-7c669.appspot.com",
});

const upload = multer({
  storage: storage,
  //  limits: { fileSize: 1000 }
});
const imageUpload = upload.single("image");

// noteRouter.use("/image", express.static("./uploads"));
noteRouter.post("/", auth, imageUpload, createNote);
noteRouter.get("/", auth, getNotes);
noteRouter.put("/:noteId", auth, imageUpload, updateNote);
noteRouter.delete("/:noteId", auth, deleteNote);

module.exports = noteRouter;
