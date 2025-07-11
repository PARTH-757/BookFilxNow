const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  show: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
  seats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seat" }],
  bookingTime: { type: Date, default: Date.now },
  totalAmount: Number
});

module.exports = mongoose.model("Booking", bookingSchema);
