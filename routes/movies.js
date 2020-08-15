const express = require("express");
const router = express.Router();
const { Genre, validate: validateGenre } = require("../models/genre");
const { Movie, validateMovie } = require("../models/movie");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  if (movies.length < 1) return res.status(204).send("No available movies");

  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.find({ _id: req.params.id });
  if (!movie || movie.length < 1)
    return res.status(404).send("This movie does not exist");

  res.send(movie);
});

router.post("/", async (req, res) => {
  try {
    const { body: data } = req;

    const { error } = validateMovie(data);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = await Genre.find({ _id: /*data.genre._id*/ data.genreId });

    if (!genre || genre.length < 1) {
      return res.status(400).send("Invalid Genre"); //NORMALLY, return straight off
      //===>  if (data.genre._id) return res.status(400).send("Invalid Genre");
      //   //this is purely for practice, genre should not be allowed for users to create on the fly
      //   else {
      //     const { error } = validateGenre(data.genre);
      //     if (error) return res.status(400).send(error.details[0].message);

      //     genre = new Genre({ name: data.genre.name });
      //     genre = await genre.save();
      //   }
    }

    genre = Array.isArray(genre) ? genre[0] : genre;
    //it sometimes try to save as array and get rejected mostly cos I first fetched it from database

    const movie = new Movie({
      title: data.title,
      genre: {
        //don't just dump the whole genre, only the needed properties, not all property
        //Also we do not want the version property from genre
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: data.numberInStock,
      dailyRentalRate: data.dailyRentalRate,
    });

    // movie = await movie.save();
    await movie.save();

    res.send(movie);
  } catch (ex) {
    console.log(ex.message);
    return res.end();
  }
});

router.put("/:id", async (req, res) => {
  const { body: data } = req;

  const { error } = validateMovie(data);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = await Genre.find({ _id: /*data.genre._id*/ data.genreId });

  if (!genre || genre.length < 1) {
    return res.status(400).send("Invalid Genre"); //NORMALLY, return straight off
    //===>  if (data.genre._id) return res.status(400).send("Invalid Genre");
    //   //this is purely for practice, genre should not be allowed for users to create on the fly
    //   else {
    //     const { error } = validateGenre(data.genre);
    //     if (error) return res.status(400).send(error.details[0].message);

    //     genre = new Genre({ name: data.genre.name });
    //     genre = await genre.save();
    //   }
  }

  genre = Array.isArray(genre) ? genre[0] : genre;
  //it sometimes try to save as array and get rejected mostly cos I first fetched it from database

  const movie = await Movie.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: data.title,
        genre: genre,
        genre: {
          //don't just dump the whole genre, only the needed properties, not all property
          //Also we do not want the version property from genre
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: data.numberInStock,
        dailyRentalRate: data.dailyRentalRate,
      },
    },
    { new: true }
  );

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete({ _id: req.params.id });
  if (!movie) return res.status(404).send("Movie not found");

  res.send(movie);
});

module.exports = router;
