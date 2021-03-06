const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { User, validateUser } = require("../models/user");

// router.get("/", async (req, res) => {
//   const users = await User.find().sort("name");

//   res.send(users);
// });   //probably routes available for admin users

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  // if (!user || user.length < 1) return res.status(404).send("User not found");

  res.send(user);
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateJwtToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (ex) {
    console.log(ex.message);
  }
});

// router.put("/:id", async (req, res) => {
//   const { error } = validateUser(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     _.pick(req.body, ["_id", "name", "email", password]),
//     { new: true }
//   );
//   if (!user) return res.status(404).send("User not found");

//   res.send(_.pick(user, ["name", "email"]));
// });

// router.delete("/:id", async (req, res) => {
//   const user = await User.findByIdAndDelete(req.params.id);
//   if (!user) return res.status(404).send("User not found");

//   res.send(user);
// });

module.exports = router;
