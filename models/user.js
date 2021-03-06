const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
// const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 100, required: true },
  email: {
    type: String,
    minlength: 5,
    maxlength: 100,
    unique: true,
  },
  password: { type: String, minlength: 7, maxlength: 255, required: true },
  // isAdmin:Boolean,
  //roles[] eg isAdmin, isRegular, isManagement, isDev
  //operations[] eg canDeleteGenre, canViewUserAmount, canUpgradeUser
  role: {
    isAdmin: Boolean,
  },
});

userSchema.methods.generateJwtToken = function () {
  //Arrow fcn should not be used here since we need ==this== keyword
  //and generally, arrow fcn is used as standalone fcn when ==this== is needed
  //not as a method in an object because arrow function do not have its own ==this==
  return jwt.sign(
    { _id: this._id, isAdmin: this.role.isAdmin },
    config.get("vidly_jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  // const complexityOptions = {
  //   min: 3,
  //   max: 30,
  //   lowerCase: 1,
  //   upperCase: 0,
  //   // numeric: 1,
  //   // symbol: 1,
  //   // requirementCount: 4,
  // };

  // a = passwordComplexity(complexityOptions).validate("user.password");
  // console.log(a.error.details[0].message);

  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(5).max(100).email(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(user);
}

module.exports = {
  User,
  validateUser,
};
