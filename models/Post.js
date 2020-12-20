const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const PostSchema = new mongoose.Schema({
  caption: {
    type: String,
    maxlength: 1000,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  user: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", PostSchema);
