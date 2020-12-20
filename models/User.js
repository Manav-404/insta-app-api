const mongoose = require("mongoose");
const crypto = require("crypto");

const uuidv1 = require("uuid/v1");
const Post = require("./Post");
const { ObjectId } = mongoose.Schema;

const PostSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
});

const FriendSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
  },
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    bookmarks: [PostSchema],
    followers: [FriendSchema],
    following: [FriendSchema],

    name: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 2000,
    },
    link: String,
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

UserSchema.virtual("password")
  .set(function (plainpassword) {
    this._password = plainpassword;
    this.salt = uuidv1();
    this.encry_password = this.securepassword(plainpassword);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securepassword(plainpassword) === this.encry_password;
  },
  securepassword: function (plainpassword) {
    if (!plainpassword) {
      return "";
    } else {
      try {
        return crypto
          .createHmac("sha256", this.salt)
          .update(plainpassword)
          .digest("hex");
      } catch (error) {
        return "";
      }
    }
  },
};

module.exports = mongoose.model("User", UserSchema);
