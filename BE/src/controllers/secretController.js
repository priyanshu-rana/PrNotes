const bcrypt = require("bcrypt");
const noteModel = require("../models/noteModel");
const userModel = require("../models/userModel");

const encryptNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { secret_key } = req.body;

  try {
    if (!secret_key) {
      return res.status(400).json({ message: "Secret key is required!" });
    }
    const user = await userModel.findById(req.userId);
    const note = await noteModel.findById(noteId);

    //TODO: Currently using password for secret_key, change it later
    const matchedSecret = await bcrypt.compare(secret_key, user.password);
    console.log("Matched Secret:", matchedSecret);
    if (!matchedSecret) {
      return res.status(400).json({ message: "Invalid secret key!" });
    }
    console.log("note.isProtected", note.isProtected);
    note.isProtected = true;
    await note.save();
    res.status(200).json({
      message: "Note is now Encrypted !",
      protected: note.isProtected,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const decryptNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { secret_key } = req.body;

  try {
    if (!secret_key) {
      return res.status(400).json({ message: "Secret key is required!" });
    }
    const user = await userModel.findById(req.userId);
    const note = await noteModel.findById(noteId);

    //TODO: Currently using password for secret_key, change it later
    const matchedSecret = await bcrypt.compare(secret_key, user.password);
    if (!matchedSecret) {
      return res.status(400).json({ message: "Invalid secret key!" });
    }
    note.isProtected = false;
    await note.save();
    res.status(200).json({
      message: "Note is now Decrypted !",
      protected: note.isProtected,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { encryptNote, decryptNote };
