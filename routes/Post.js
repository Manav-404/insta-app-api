const express = require("express");
const { getUserById } = require("../controller/Profile");
const { isSignIn, isAuthenticated } = require("../controller/Auth");
const router = express.Router();
const {
  getPostById,
  getPostsForUserId,
  createPost,
  createPostComment,
  getAllPostCommentsByPostId,
  createBookmarks,
  getBookmarksByUserId,
  getFriendPosts,
  getFriendPostForId,
  photo,
  getPostByPostId,
  getBookmarks,
} = require("../controller/Post");

router.param("userId", getUserById);
router.param("postId", getPostById);

router.get("/posts/:userId", isSignIn, getPostsForUserId);
router.get("/posts/:postId", isSignIn, getPostByPostId);
router.get("/posts/photo/:postId", photo);
router.get(
  "/posts/friend/:userId",
  isSignIn,
  getFriendPostForId,
  getFriendPosts
);

router.post("/posts/create/:userId", isSignIn, isAuthenticated, createPost);

router.post(
  "/posts/comment/create/:postId/:userId",
  isSignIn,
  isAuthenticated,
  createPostComment
);

router.get("/posts/comment/:postId", isSignIn, getAllPostCommentsByPostId);

router.post(
  "/posts/bookmark/:postId/:userId",
  isSignIn,
  isAuthenticated,
  createBookmarks
);

router.get(
  "/posts/bookmark/:userId",
  isSignIn,
  isAuthenticated,
  getBookmarksByUserId,
  getBookmarks
);

module.exports = router;
