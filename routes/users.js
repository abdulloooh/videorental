const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");

  res.send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.find({ _id: req.params.id });
  if (!user || user.length < 1) return res.status(404).send("User not found");

  res.send(user);
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    res.send(user);
  } catch (ex) {
    console.log(ex.message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    { new: true }
  );
  if (!user) return res.status(404).send("User not found");

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("User not found");

  res.send(user);
});

module.exports = router;
