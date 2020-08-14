const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const mongoose = require("mongoose");
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

Fawn.init(mongoose);
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("dateOut");
  if (rentals.length < 1) return res.status(204).send("No available rentals");

  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.find({ _id: req.params.id });
  if (!rental || rental.length < 1)
    return res.status(404).send("This rental does not exist");

  res.send(rental);
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid Customer");

    let movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send("Invalid Movie");

    if (movie.numberInStock < 1)
      return res.status(400).send("Movie out of Stock");

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    try {
      new Fawn.Task()
        .save("rentals", rental)
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: -25 } })
        // .remove()
        .run({ useMongoose: true });
      res.send(rental);
    } catch (ex) {
      return res.status(500).send(`Internal error ${ex.message}`); //log the error
    }
  } catch (ex) {
    console.log(ex.message); //internal error, log it!
    return res.end();
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(400).send("Invalid Rental");

  rental.dateToReturn = req.body.dateToReturn;

  rental = await rental.save();

  res.send(rental);
});

router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndDelete({ _id: req.params.id });
  if (!rental) return res.status(404).send("Rental not found");

  res.send(rental);
});

module.exports = router;
