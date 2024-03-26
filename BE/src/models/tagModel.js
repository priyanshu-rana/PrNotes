const mongoose = require("mongoose");

const TagSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Tag", TagSchema);
