const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const NotificationSchema = new mongoose.Schema({
  from_user: {
    type: ObjectId,
    ref: "User",
  },
  to_user: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
