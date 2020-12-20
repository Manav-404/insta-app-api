const express = require("express");
const { check } = require("express-validator");
const { signup, signin, signout } = require("../controller/Auth");
const router = express.Router();

router.get("/signout", signout);

router.post(
  "/signup",
  [
    check("username")
      .isLength({ min: 3 })
      .withMessage("Name should be at least 3 characters"),
    check("email").isEmail().withMessage("Email is required"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password should at least have 8 characters"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Email is required"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password should at least have 8 characters"),
  ],
  signin
);

module.exports = router;
