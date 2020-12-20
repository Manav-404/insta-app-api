const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
  },
  post: {
    type: ObjectId,
    ref: "Post",
  },
  comment: {
    type: String,
    maxlength: 500,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
