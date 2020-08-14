const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const { genreSchema } = require("./genre.js");

const movieSchema = new mongoose.Schema({
  title: { type: String, minlength: 3, maxlength: 50, required: true },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, required: true, min: 1 },
  dailyRentalRate: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    genre: Joi.object().required(),
    numberInStock: Joi.number().min(1).required(),
    dailyRentalRate: Joi.number(),
  });

  return schema.validate(movie);
}

module.exports = {
  Movie,
  validateMovie,
};
