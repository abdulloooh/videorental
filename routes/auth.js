const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).send("Invalid user email or password");

    const token = user.generateJwtToken();
    res.send(token);
  } catch (ex) {
    console.log(ex.message);
  }
});

// router.delete("/:id", async (req, res) => {
//   const user = await User.findByIdAndDelete(req.params.id);
//   if (!user) return res.status(404).send("User not found");

//   res.send(user);
// });

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(100).email(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(user);
}

module.exports = router;
