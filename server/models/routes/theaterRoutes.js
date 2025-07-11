// routes/theaterRoutes.js
const express = require("express");
const router = express.Router();
const Theater = require("../Theater");

// GET all theaters
router.get("/", async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (err) {
    console.error("Error fetching theaters:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
