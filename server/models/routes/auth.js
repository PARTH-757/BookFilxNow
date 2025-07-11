const express = require("express");
const bcrypt = require("bcryptjs");//used to hash passwords and compare them securely.
const jwt = require("jsonwebtoken");// used to sign and verify JWT tokens
const User = require("../User"); 
const router = express.Router();

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

//  Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password, isAdmin = false } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already in use" });

    const hashedPwd = await bcrypt.hash(password, 10);//Securely hashes the password with 10 salt rounds.
    const user = new User({ name, email, password: hashedPwd, isAdmin });
    await user.save();

//Create a JWT token that expires in 1 hour.
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const redirectTo = user.isAdmin ? "/admin" : "/home";

    res.json({
      msg: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      redirectTo,
    });//response in json format
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

//  Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
//same way Create a JWT token that expires in 1 hour.
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const redirectTo = user.isAdmin ? "/admin" : "/home";
//post the response in user json file
    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      redirectTo,
    });
  } catch (err) {
    console.error(" Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
