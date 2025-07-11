const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Show = require("../Show");
const Seat = require("../Seat");

// Route 1: Get all shows for a specific movie
router.get("/movie/:movieId", async (req, res) => {
  const { movieId } = req.params;//parse by movieid

  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: "Invalid movie ID format" });//if id is not M.T.Ob valid
  }

  try {
    const shows = await Show.find({ movie: movieId })//find all shows of that movieid
      .populate("theater", "name location")
      .sort("showTime");

    if (!shows || shows.length === 0) {
      return res.status(404).json({ message: "No shows found for this movie." });
    }

    res.json(shows);
  } catch (error) {
    console.error(" Error fetching shows for movie:", error);
    res.status(500).json({ message: "Server error while fetching shows." });
  }
});

//  Route 2: Get seats for a specific show
router.get("/:showId/seats", async (req, res) => {
  const { showId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(showId)) {
    return res.status(400).json({ message: "Invalid show ID format" });
  }

  try {
    const seats = await Seat.find({ show: showId });
    res.json(seats);
  } catch (err) {
    console.error("Error fetching seats:", err);
    res.status(500).json({ message: "Server error while fetching seats." });
  }
});

//  Route 3: Get all shows (explicit /all path - optional now)
router.get("/all", async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("movie", "title")
      .populate("theater", "name location")
      .sort("showTime");

    res.json(shows);
  } catch (err) {
    console.error(" Error fetching all shows:", err);
    res.status(500).json({ message: "Server error while fetching all shows." });
  }
});

//  Route 4: Default GET /api/shows - returns all shows (RESTful way) just as top one but in a restful way this is default above one is preffered while debugging and redability
router.get("/", async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("movie", "title")
      .populate("theater", "name location")
      .sort("showTime");

    res.json(shows);
  } catch (err) {
    console.error(" Error fetching shows:", err);
    res.status(500).json({ message: "Server error while fetching shows." });
  }
});

module.exports = router;
