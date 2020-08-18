require("express-async-errors");
require("winston-mongodb");

module.exports = function (winston) {
  process.quit = () =>
    setTimeout(() => {
      process.exit(1);
    }, 300);

  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
    process.quit();
  }); //can use winston to handle uncaughtExceptions, so a new file can be specified for that if needed

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.configure({
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log", level: "info" }),
      new winston.transports.MongoDB({
        db: "mongodb://localhost/vidly",
        level: "warn",
      }),
    ],
  });

  if (process.env.NODE_ENV !== "production")
    winston.add(
      new winston.transports.Console({ colorize: true, prettyPrint: true })
    );
};
