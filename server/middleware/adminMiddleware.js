// middleware/adminMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];//extracting auth token from request header
    if (!token) return res.status(401).json({ msg: "No token, access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);//verifying with my private key at server
    const user = await User.findById(decoded.id);//extracting user from the token by his id

    if (!user || !user.isAdmin) return res.status(403).json({ msg: "Access forbidden" });// checkting if hes admin

    req.user = user; // Optional: attach user to request
    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = verifyAdmin;
