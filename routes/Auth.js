const express = require("express");
const {
  createUser,
  loginUser,
  checkAuth,
  profileUpload,
  signOut,
} = require("../controller/Auth.js");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .post("/signup", upload.single("profilePic"), createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", passport.authenticate("jwt"), checkAuth)
  .get("/logout", signOut);

exports.router = router;
