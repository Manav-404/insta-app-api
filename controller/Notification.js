const Notification = require("../models/Notification");
const { check } = require("express-validator");
const User = require("../models/User");

exports.getNotificationById = (req, res, next, id) => {
  Notification.findById(id).exec((error, notification) => {
    if (error || !notification) {
      return res.status(400).json({
        error: "Unable to find the notification",
      });
    }

    req.notification = notification;
    next();
  });
};

exports.getUserByFriendId = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "No user found",
      });
    }

    req.friend = user;
    next();
  });
};

exports.getNotifications = (req, res) => {
  Notification.find({ to_user: req.user._id })
    .populate("from_user")
    .sort("-createdDate")
    .exec((error, notifications) => {
      if (error) {
        return res.status(400).json({
          error: "No notifications found",
        });
      }

      return res.json({
        notifications,
      });
    });
};

exports.createNotification = (req, res) => {
  let to_user = req.friend;
  let from_user = req.user;

  let notification = new Notification({ from_user, to_user });

  notification.save((error, not) => {
    if (error) {
      return res.status(400).json({
        error: "Error creating notification",
      });
    }

    const { _id, from_user, to_user } = not;
    return res.json({
      _id: _id,
      from_user: from_user._id,
      to_user: to_user._id,
    });
  });

  User.updateOne(
    { _id: from_user._id },
    { $addToSet: { following: { $each: [to_user] } } },
    (error, user) => {}
  );

  User.updateOne(
    { _id: to_user._id },
    { $addToSet: { followers: { $each: [from_user] } } },
    (error, user) => {}
  );
};

exports.deleteNotification = (req, res) => {};
