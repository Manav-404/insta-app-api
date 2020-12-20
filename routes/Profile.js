const express = require("express");
const router = express.Router();
const { isSignIn, isAuthenticated } = require("../controller/Auth");
const {
  getUserById,
  getUserByName,
  getProfileByUserId,
  getProfileBySearch,
  photo,
  createProfile,
  deleteProfile,
} = require("../controller/Profile");

router.param("userId", getUserById);
router.param("name", getUserByName);

router.get("/profile/:userId", isSignIn, getProfileByUserId);
router.get("/profile/list/:name", isSignIn, getProfileBySearch);
router.get("/profile/photo/:userId", photo);

router.post(
  "/profile/create/:userId",
  isSignIn,
  isAuthenticated,
  createProfile
);

router.delete(
  "/profile/delete/:userId",
  isSignIn,
  isAuthenticated,
  deleteProfile
);

module.exports = router;
