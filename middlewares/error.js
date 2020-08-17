module.exports = function (err, req, res, next) {
  console.log(err.message); //log error
  res.sendStatus(500);
  // next(err);
};
