const { User } = require("../model/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const file = req.file;

    const fileName = generateFileName();

    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({
          ...req.body,
          password: hashedPassword,
          salt,
          profilePic: fileName,
        });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(
              sanitizeUser(doc),
              process.env.JWT_SECRET_KEY
            );

            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 36000000),
                httpOnly: true,
              })
              .status(201)
              .json({ id: doc.id, role: doc.role });
          }
        });
      }
    );
  } catch (err) {
    console.log("err:", err);
    res.status(400).json(err);
  }
};

exports.checkAuth = async (req, res) => {
  if (req.user) {
    console.log("checkAuth");
    console.log(req.user);
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

exports.loginUser = async (req, res) => {
  const token = jwt.sign(sanitizeUser(req.user), process.env.JWT_SECRET_KEY);
  res
    .cookie("jwt", token, {
      expires: new Date(Date.now() + 36000000),
      httpOnly: true,
      path: "/",
    })
    .status(200)
    .json({ id: req.user.id, role: req.user.role });
};

exports.signOut = async (req, res) => {
  res
    .clearCookie("jwt", {
      httpOnly: true,
      secure: false, // Set this to true if your app uses HTTPS
      path: "/",
    })
    .sendStatus(200);
};
