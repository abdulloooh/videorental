const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 100, required: true },
  email: {
    type: String,
    minlength: 5,
    maxlength: 100,
    unique: true,
  },
  password: { type: String, minlength: 7, maxlength: 255, required: true },
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(5).max(100).email(),
    password: Joi.string().min(8).max(255),
  });
  return schema.validate(user);
}

module.exports = {
  User,
  validateUser,
};
