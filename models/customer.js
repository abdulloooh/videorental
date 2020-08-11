const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
  phone: { type: String, required: true, minlength: 8, maxlength: 20 },
});

const Customer = mongoose.model("customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string().min(8).max(20).required(),
  });
  return schema.validate(customer);
}

module.exports = {
  Customer,
  validate: validateCustomer,
};
