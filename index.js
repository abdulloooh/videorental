const express = require("express");
const app = express();
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");

mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(() => console.log("Connected to mongodb successfully"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
