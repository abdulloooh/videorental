const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(() => console.log("Connected to mongodb..."));

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Genre = mongoose.model("genre", genreSchema);

async function getGenres() {
  try {
    return await Genre.find();
  } catch (err) {
    console.log(err.message);
  }
}

async function getGenre(id) {
  try {
    return await Genre.find({ _id: id });
  } catch (err) {
    console.log(err.message);
  }
}

async function createGenre(genre) {
  try {
    let g = new Genre(genre);
    return await g.save();
  } catch (err) {
    console.log(err.message);
  }
}

async function updateGenre(id, genre) {
  try {
    const genre = Genre.findByIdAndUpdate(
      id,
      {
        $set: { name: genre.name },
      },
      { new: true }
    );
    return genre;
  } catch (err) {
    return new Error(err.message);
  }

  // return genre;
}

async function deleteGenre(id) {
  try {
    return await Genre.findByIdAndDelete(id);
  } catch (err) {}
}
// const genres = [
//   { id: 1, name: "Action" },
//   { id: 2, name: "Comedy" },
//   { id: 3, name: "Romance" },
// ];

router.get("/", async (req, res) => res.send(await getGenres()));

router.get("/:id", async (req, res) => {
  // const genre = genres.find((g) => g.id === parseInt(req.params.id));
  const genre = await getGenre(req.params.id);
  if (!genre) return res.status(404).send("Genre not found");
  res.send(genre);
});

router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    // id: genres.length + 1,
    name: req.body.name,
  };

  createGenre(genre)
    .then((g) => {
      console.log("hey");
      res.send(g);
    })
    .catch((err) => {
      console.log("hu");
      console.log(err.message);
    });
});

router.put("/:id", (req, res) => {
  // const genre = genres.find((g) => g.id === parseInt(req.params.id));
  // if (!genre) return res.status(404).send("Genre not found");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  updateGenre(req.params.id, req.body)
    .then((g) => res.send(g))
    .catch((err) => console.log(err.message));

  // genre.name = req.body.name;
});

router.delete("/:id", (req, res) => {
  // const genre = genres.find((g) => g.id === parseInt(req.params.id));
  // if (!genre) return res.status(404).send("Genre not found");

  // genres.splice(genres.indexOf(genre), 1);

  // res.send(genre);

  deleteGenre(req.params.id).then((g) => res.send(g));
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

module.exports = router;
