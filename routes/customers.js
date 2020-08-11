const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
  phone: { type: String, required: true, minlength: 8, maxlength: 20 },
});

const Customer = mongoose.model("customer", customerSchema);

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");

  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.find({ _id: req.params.id });
  if (!customer || customer.length < 1)
    return res.status(404).send("Customer not found");

  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });
  customer = await customer.save();

  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );
  if (!customer) return res.status(404).send("Customer not found");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).send("Customer not found");

  res.send(customer);
});

function validateCustomer(customer) {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string().min(8).max(20).required(),
  });
  return schema.validate(customer);
}

module.exports = router;
