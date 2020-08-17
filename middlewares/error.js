const winston = require("winston");
module.exports = function (err, req, res, next) {
  winston.error(err.message, err);
  res.sendStatus(500);
  // next(err);
};

/*
  error == warn == info == verbose == debug == silly
  <-------------------------------------------------
*/
