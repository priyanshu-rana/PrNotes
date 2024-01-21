const admin = require("firebase-admin");
const noteModel = require("../models/noteModel");
// const UUID = require("uuidv4");

const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;
    // let uuid = UUID;
    const bucket = admin.storage().bucket("gs://prnotes-7c669.appspot.com");
    const fileName = `${Date.now()}-${file?.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      console.log("Error while uploading image", err);
      res.status(500).json({ error: "Image upload failed!" });
    });
    blobStream.on("finish", async () => {
      const signedUrlConfig = {
        action: "read",
        // expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
        expires: Date.now() + 315532800, // URL expires in 10 years {approx}
      };
      // const imageResponse = await bucket.upload(
      //   "gs://prnotes-7c669.appspot.com",
      //   {
      //     destination: `image/${file?.originalname}`,
      //     resumable: true,
      //     metadata: {
      //       metadata: {
      //         firebaseStorageDownloadTokens: uuid,
      //       },
      //     },
      //   }
      // );

      const [signedUrl] = await blob.getSignedUrl(signedUrlConfig);
      // const publicUrl = `https://storage.googleapis.com/v0/b/${
      //   bucket.name
      // }${encodeURIComponent(imageResponse[0].name)}?alt=media&token=${uuid}`;

      const newNote = new noteModel({
        // new keyword
        title: title,
        description: description,
        userId: req.userId,
        image: file && signedUrl,
      });
      await newNote.save();
      res
        .status(201)
        .json({ message: "Note created successfull", data: { newNote } });
    });
    blobStream.end(file?.buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Note creation failed" });
  }
};

// create new api as we accept attachment url insted of attachment
const modifiedCreateNote = async (req, res) => {
  try {
    const { title, description, attachmentUrl } = req.body;
    const newNote = noteModel({
      title: title,
      description: description,
      attachmentUrl: attachmentUrl,
      userId: req.userId,
    });
    await newNote.save();
    res
      .status(201)
      .json({ message: "Note created successfull", data: { newNote } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Note creation failed" });
  }
};

const updateNote = async (req, res) => {
  try {
    const noteId = req.params.noteId; //noteId is from paramas --> line.no 13 noteRoute
    const file = req.file;
    const { title, description, done } = req.body;
    const bucket = admin.storage().bucket("gs://prnotes-7c669.appspot.com");
    const fileName = `${Date.now()}-${file?.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();
    const note = await noteModel.findById(noteId);
    blobStream.on("error", (err) => {
      console.log("Error while uploading image", err);
      res.status(500).json({ error: "Image upload failed!" });
    });
    blobStream.on("finish", async () => {
      const signedUrlConfig = {
        action: "read",
        // expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
        expires: Date.now() + 315532800, // URL expires in 10 years {approx}
      };

      const [signedUrl] = await blob.getSignedUrl(signedUrlConfig);
      const newNote = {
        title: title,
        description: description,
        done: done,
        userId: req.userId,
        image: file ? signedUrl : note.image,
      };

      await noteModel.findByIdAndUpdate(noteId, newNote, { new: true });
      res.status(200).json({ message: "Note is updated!", data: { newNote } });
    });
    blobStream.end(file?.buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find({ userId: req.userId });
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteNote = async (req, res) => {
  const noteId = req.params.noteId; //noteId is from paramas --> line.no 14 noteRoutes
  try {
    const note = await noteModel.findByIdAndDelete(noteId);
    // const imagePath = `./uploads/${note.image}`;
    // fs.remove(imagePath)
    //   .then(() => console.log("Image deleted sucessfully"))
    //   .catch((e) => console.log(e));
    res.status(202).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createNote,
  modifiedCreateNote,
  getNotes,
  updateNote,
  deleteNote,
};
