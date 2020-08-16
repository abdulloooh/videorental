const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //technically I do not need to get/verify token since it should first be passed through auth middleware
  if (!req.user.isAdmin) return res.status(403).send("Access denied");

  next();
};
