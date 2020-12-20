const express = require("express");
const { isSignIn, isAuthenticated } = require("../controller/Auth");
const { getUserById } = require("../controller/Profile");
const router = express.Router();
const {
  getNotificationById,
  getNotifications,
  createNotification,
  deleteNotification,
  getUserByFriendId,
} = require("../controller/Notification");

router.param("userId", getUserById);
router.param("friendId", getUserByFriendId);
router.param("notificationId", getNotificationById);

router.get("/notfications/:userId", isSignIn, getNotifications);

router.post(
  "/notifications/create/:userId/:friendId",
  isSignIn,
  isAuthenticated,
  createNotification
);

router.delete(
  "/notification/delete/:userId/:notificationId",
  isSignIn,
  isAuthenticated,
  deleteNotification
);

module.exports = router;
