const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const { genreSchema } = require("./genre.js");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    trim: true,
  },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, required: true, min: 0, max: 1000000 },
  dailyRentalRate: { type: Number, min: 0, max: 100 },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    // genre: Joi.object().required(),
    genreId: Joi.string().max(255).required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number(),
  });

  return schema.validate(movie);
}

module.exports = {
  Movie,
  validateMovie,
};
