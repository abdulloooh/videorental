module.exports = function (app) {
  const winston = require("winston");
  const config = require("config");
  const Joi = require("@hapi/joi");
  Joi.objectId = require("joi-objectid")(Joi);

  require("./logging")(winston);
  require("../startup/db")(winston);
  require("../startup/routes")(app);
  require("../startup/prod")(app);

  if (!config.get("vidly_jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwt private key not defined");
  }

  //   throw new Error("POPL");
  //   Promise.reject(new Error("er"));
};
