// This function is used to create JWT Token

const jwt = require("jsonwebtoken");
require("dotenv").config();

const createJWTToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });
  return token;
};

module.exports = createJWTToken;
