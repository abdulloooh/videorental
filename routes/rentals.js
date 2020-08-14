const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

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
    if (!customer) return res.status(404).send("Customer not found");

    //decrement numberInStock of Movies by 1
    //Calculate and update dailyRentalRental rate also if need be
    let movie = await Movie.findByIdAndUpdate(
      { _id: req.body.movieId },
      {
        $inc: { numberInStock: -1 },
      },
      { new: true }
    );

    if (!movie) return res.status(404).send("Movie not found");

    let rental = new Rental({
      customer: {
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold,
      },
      movie: {
        title: movie.title,
      },
      amount: req.body.amount,
      numberInStock: movie.numberInStock, //what will remain after
      dailyRentalRate: movie.dailyRentalRate,
    });

    try {
      rental = await rental.save();
      res.send(rental);
    } catch (ex) {
      //if this guy fails, increment movie number back
      movie = await Movie.findByIdAndUpdate(
        { _id: req.body.movieId },
        {
          $inc: { numberInStock: 1 },
        },
        { new: true }
      );
      return res.status(400).send(ex.message);
    }
  } catch (ex) {
    console.log(ex.message);
    return res.end();
  }
});

router.put("/:id", async (req, res) => {
  // amount, dateToReturn, numberInStock
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Data not available");

  rental.amount = req.body.amount;
  rental.dateToReturn = req.body.dateToReturn;
  rental.numberInStock = req.body.numberInStock;

  rental = await rental.save();

  res.send(rental);
});

router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndDelete({ _id: req.params.id });
  if (!rental) return res.status(404).send("Rental not found");

  res.send(rental);
});

module.exports = router;
