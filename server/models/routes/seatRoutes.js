const express = require("express");
const router = express.Router();
const Seat = require("../Seat");

// a. Get seats for a show based on showid
router.get("/shows/:showId/seats", async (req, res) => {
  try {
    const seats = await Seat.find({ show: req.params.showId });
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seats" });
  }
});


//  Book seats
router.post("/book", async (req, res) => {
  const { seatIds } = req.body;
  try {
    await Seat.updateMany(// changes seats status
      { _id: { $in: seatIds } },
      { $set: { isBooked: true } }
    );
    res.status(200).json({ message: "Seats booked!" });
  } catch (err) {
    console.error(" Booking error:", err);
    res.status(500).json({ message: "Error booking seats" });
  }
});

// Cancel seats
router.post("/cancel", async (req, res) => {
  const { seatIds } = req.body;
  try {
    await Seat.updateMany(
      { _id: { $in: seatIds } },//change seat status
      { $set: { isBooked: false } }
    );
    res.status(200).json({ message: "Seats cancelled!" });
  } catch (err) {
    console.error(" Cancel error:", err);
    res.status(500).json({ message: "Error cancelling seats" });
  }
});



module.exports = router;
