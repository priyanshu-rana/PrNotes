const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    done: {
      type: Boolean,
      required: false,
    },
    attachmentUrl: {
      type: String,
      required: false,
    },
    tagIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Tag",
        required: false,
      },
    ],
    isProtected: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
