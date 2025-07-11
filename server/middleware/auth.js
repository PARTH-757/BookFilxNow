//function of a middleware:next: move to the next route handler if the request is valid.( like a toll gate i guess )

const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env

const JWT_SECRET = process.env.JWT_SECRET; // Get secret from .env

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");//It checks for a token in the x-auth-token header of the incoming HTTP request.

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // Allow request to continue
  } catch (err) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};
