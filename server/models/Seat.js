const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
  seatNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  userId: { type: String, default: null }
});

module.exports = mongoose.model("Seat", seatSchema);
