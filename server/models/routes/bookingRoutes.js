// routes/booking.js
const express = require("express");
const router = express.Router();
const Booking = require("../Booking");
const auth = require("../../middleware/auth");

// Protected booking creation route (requires token in frontend)
router.post("/", auth, async (req, res) => {//this line, uses auth middleware to verify JWT token and extract user info (req.user.id
  try {
    const { showId, seats, totalAmount } = req.body;

    const newBooking = new Booking({
      user: req.user.id, // This comes from the verified token
      show: showId,
      seats,
      totalAmount
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating booking" });
  }
});

//  Protected route: Get logged-in user's bookings
router.get("/mybookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("show");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user bookings" });
  }
});


module.exports = router;
{/*This auth function is middleware that runs before route handler, :
Checks the JWT token from the request header.
Verifies the token using a secret key.
If valid, it adds the user info (like user.id) to req.user.
If invalid/missing, it blocks the request with 401 Unauthorized.

in frontend, after the user logs in, it store the JWT in localStorage*/}
