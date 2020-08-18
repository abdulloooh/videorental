const winston = require("winston");
require("winston-mongodb");
const express = require("express");
const app = express();
const config = require("config");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const asyncError = require("./middlewares/error");

process.quit = () =>
  setTimeout(() => {
    process.exit(1);
  }, 300);

process.on("uncaughtException", (ex) => {
  winston.error(ex.message, ex);
  process.quit();
});

process.on("unhandledRejection", (ex) => {
  throw ex;
});

winston.configure({
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log", level: "info" }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "info",
    }),
  ],
});

if (process.env.NODE_ENV !== "production")
  winston.add(new winston.transports.Console());

if (!config.get("vidly_jwtPrivateKey")) {
  winston.error("FATAL ERROR: jwt private key not defined");
  console.log("wuah");
  process.quit();
}

mongoose
  .connect("mongodb://localhost/vidly", {
    // poolSize: 10,
    // bufferMaxEntries: 0,
    reconnectTries: 5000,
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongodb successfully"))
  .catch((err) => {
    winston.error(err.message, err);
    process.quit();
  });

// throw new Error("POPL");
// Promise.reject(new Error("er"));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(asyncError);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port}`));
