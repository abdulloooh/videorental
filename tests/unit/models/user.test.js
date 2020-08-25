const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const config = require("config");

describe("user.generateToken", () => {
  it("Should return a signed token", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      role: { isAdmin: true },
    };
    const user = new User(payload);
    const token = user.generateJwtToken();

    const result = jwt.verify(token, config.get("vidly_jwtPrivateKey"));
    expect(result).toMatchObject({
      _id: payload._id,
      isAdmin: payload.role.isAdmin,
    });
  });
});
