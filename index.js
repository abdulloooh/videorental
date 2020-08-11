const express = require("express");
const genres = require("./routes/genres");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(() => console.log("Connected to mongodb successfully"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
