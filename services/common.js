const passport = require("passport");
const nodemailer = require("nodemailer");


exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};


exports.cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }

  return token;
};

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

