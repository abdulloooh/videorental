const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Genre = mongoose.model("genre", genreSchema);

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");

  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.find({ _id: req.params.id });
  if (!genre || genre.length < 1)
    return res.status(404).send("Genre not found");

  res.send(genre);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

module.exports = router;
