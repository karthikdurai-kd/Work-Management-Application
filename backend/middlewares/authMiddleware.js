// This is Authentication middleware

const jwt = require("jsonwebtoken");
require("dotenv").config();
const appErr = require("../utils/appErr");

const authMiddleware = (req, res, next) => {
  try {
    // Step-1: Get Token from headers [req.header]
    const token = req.headers.authorization.split(" ")[1];

    // Step-2: Verify Token and get the decoded token data [payload which is userID which we used while creating tokens]
    const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Step-3: Append the decoded token data into req object
    req.userID = decodedTokenData.id; // Appending the decoded token data [userID] into req object
    next();
  } catch (err) {
    const errObj = appErr("Invalid / Expired Token", 401);
    next(errObj);
  }
};

module.exports = authMiddleware;
