const Post = require("../models/Post");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { post } = require("../routes/Post");

exports.getPostById = (req, res, next, id) => {
  Post.findById(id).exec((err, data) => {
    if (err || !data) {
      return res.status(400).json({
        error: "Looks like theres no post :)",
      });
    }

    req.post = data;
    next();
  });
};

exports.getPostsForUserId = (req, res) => {
  Post.find({ user: req.user._id })
    .populate("user", "_id , username ")
    .select("-photo")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: "Error in finding posts",
        });
      }

      if (posts.length <= 0) {
        return res.status(400).json({
          error: "Looks like theres no post :)",
        });
      }

      return res.json(posts);
    });
};

exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, feilds, file) => {
    if (err) {
      return res.status(400).json({
        error: "Please try again",
      });
    }

    const { caption } = feilds;

    if (!caption) {
      return res.status(400).json({
        error: "All feilds are required",
      });
    }

    let post = new Post(feilds);

    if (file.photo) {
      if (file.photo.size > 4000000) {
        return res.status(400).json({
          error: "The size of the file is more than 4MB ",
        });
      }
    }

    post.user = req.user;
    post.photo.data = fs.readFileSync(file.photo.path);
    post.photo.contentType = file.photo.type;

    post.save((error, post) => {
      if (error) {
        return res.status(400).json({
          error: "Problem in creating post. Please try again.",
        });
      }
      return res.json(post);
    });
  });
};

exports.photo = (req, res, next) => {
  if (req.post.photo.data) {
    res.set("Content-Type", req.post.photo.contentType);
    res.send(req.post.photo.data);
    next();
  }
};

exports.createPostComment = (req, res) => {
  let comment = new Comment(req.body);
  comment.user = req.user;
  comment.post = req.post;

  comment.save((error, comment) => {
    if (error) {
      return res.status(400).json({
        error: "PCould not post comment. Please try again.",
      });
    }
    comment.post = undefined;
    comment.user = undefined;
    return res.json({ comment });
  });
};

exports.getAllPostCommentsByPostId = (req, res) => {
  Comment.find({ post: req.post._id })
    .populate("user", "_id username")
    .exec((error, comments) => {
      if (error) {
        return res.status(400).json({
          error: "Error in finding comments",
        });
      }

      if (comments.length <= 0) {
        return res.status(400).json({
          error: "Looks like theres no comment on this post :)",
        });
      }

      return res.json(comments);
    });
};

exports.createBookmarks = (req, res) => {
  let post = req.post;
  let user = req.user;

  User.findByIdAndUpdate(
    { _id: user._id },
    { $addToSet: { bookmarks: { $each: [post] } } },
    (error, document) => {
      if (error) {
        return res.status(400).json({
          error: "Could not add to bookmarks",
        });
      }

      const { _id, username, bookmarks } = document;

      return res.json({ _id, username, bookmarks });
    }
  );
};

exports.getBookmarksByUserId = (req, res, next) => {
  let bookmarks = req.user.bookmarks;
  let posts = [];
  if (bookmarks.length > 0) {
    bookmarks.map((bookmark) => {
      let _id = bookmark._id;
      Post.findById(_id)
        .populate("user", "_id  name")
        .select("-photo")
        .exec((err, post) => {
          if (err) {
            return res.status(400).json({
              error: "Error in finding posts",
            });
          }
          posts.push(post);
        });
    });
  }

  setTimeout(() => {
    req.bookmarksList = posts;
    next();
  }, 1000);
};

exports.getBookmarks = (req, res) => {
  const bookmarks = req.bookmarksList;
  return res.json(bookmarks);
};

exports.getFriendPostForId = (req, res, next) => {
  const user = req.user;
  const friends = user.following;
  var list = [];
  if (friends.length > 0) {
    friends.map((friend, index) => {
      Post.find({ user: friend._id })
        .populate("user", "_id , username")
        .select("-photo")
        .exec((error, post) => {
          if (error) {
            return res.status(400).json({
              error: "Error in finding posts",
            });
          }

          if (post.length > 0) {
            post.map((p, index) => {
              list.push(p);
            });
          }
        });
    });
  }
  setTimeout(() => {
    req.list = list;
    next();
  }, 1000);
};

exports.getFriendPosts = (req, res) => {
  return res.json(req.list);
};

exports.getPostByPostId = (req, res) => {
  const post = req.post;
  post.user = undefined;
  post.photo = undefined;
  return res.json(post);
};
