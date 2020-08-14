const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const rentalSchema = new mongoose.Schema({
  customer: new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    phone: { type: String, required: true, minlength: 8, maxlength: 20 },
    isGold: { type: Boolean, default: false },
  }),
  movie: new mongoose.Schema({
    title: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
      trim: true,
    },
    dailyRentalRate: { type: Number, required: true, min: 0, max: 100 },
  }),
  dateOut: { type: Date, default: Date.now() },
  dateToReturn: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 5),
  },
  dateReturned: Date,
  rentalFee: { type: Number, min: 0 },
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
    dateToReturn: Joi.date(),
  });

  return schema.validate(rental);
}

module.exports = {
  Rental,
  validateRental,
};
