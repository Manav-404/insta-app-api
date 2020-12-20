const User = require("../models/User");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "No user found",
      });
    }

    req.user = user;
    next();
  });
};

exports.getUserByName = (req, res, next, name) => {
  User.find({ name: new RegExp(name, "i") }).exec((error, users) => {
    if (error || !users) {
      return res.status(400).json({
        error: "No users found",
      });
    }

    req.users = users;
    next();
  });
};

exports.photo = (req, res, next) => {
  if (req.user.photo.data) {
    res.set("Content-Type", req.user.photo.type);
    res.send(req.user.photo.data);
    next();
  }
};

exports.getProfileByUserId = (req, res) => {
  req.user.salt = undefined;
  req.user.encry_password = undefined;
  req.user.createdAt = undefined;
  req.user.updatedAt = undefined;
  req.user.photo = undefined;
  req.user.email = undefined;
  req.user.salt = undefined;
  return res.json(req.user);
};

exports.getProfileBySearch = (req, res) => {
  let users = req.users;
  let finalList = [];
  users.map((user) => {
    user.salt = undefined;
    user.encry_password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    user.photo = undefined;
    finalList.push(user);
  });

  return res.json(finalList);
};

exports.createProfile = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, feilds, file) => {
    if (error) {
      return res.status(400).json({
        error: "Please try again",
      });
    }

    const { name, bio, link } = feilds;

    if (!name || !bio || !link) {
      return res.status(400).json({
        error: "All feilds are compulsory",
      });
    }

    if (file.photo) {
      if (file.photo.size > 4000000) {
        return res.status(400).json({
          error: "The size of the file is more than 4MB ",
        });
      }
    }

    let user = req.user;

    user = _.extend(user, feilds);
    user.photo.data = fs.readFileSync(file.photo.path);
    user.photo.contentType = file.photo.type;

    user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          error: "Problem in updating the profile",
        });
      }

      const { _id, username, name, following } = user;
      if (following.length === 0) {
        let following = [];
        return res.json({ _id, username, name, following });
      } else {
        return res.json({ _id, username, name, following });
      }
    });
  });
};

exports.deleteProfile = (req, res) => {
  let user = req.user;

  user.remove((err, user) => {
    if (err) {
      res.status(400).json({
        error: `Failed to delete the ${user.name}'s account`,
      });
    }

    return res.json({
      message: "Account Deleted Succesfully",
    });
  });
};
