 const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyAdmin = require("../../middleware/adminMiddleware");

const User = require("../User");
const Booking = require("../Booking");
const Movie = require("../Movie");
const Show = require("../Show");
const Seat = require("../Seat");
const Theater = require("../Theater");

// --------------------  Helper: Create Seats --------------------
const createSeatsForShow = async (showId) => {
  const seats = [];

  for (let row = 0; row < 5; row++) {
    for (let col = 1; col <= 10; col++) {
      const seatNumber = String.fromCharCode(65 + row) + col; // A1–E10
      seats.push({ show: showId, seatNumber, isBooked: false });
    }
  }

  return await Seat.insertMany(seats);
};

// --------------------  Route 1: Get all users --------------------
router.get("/users", verifyAdmin, async (req, res) => {//verifyadmin function makes sure only admins can access all this
  try {
    const users = await User.find({}, "name email");// Only return the name and email fields for each user (exclude password, id for safety).
    res.json(users);
  } catch (err) {
    console.error(" [GET /users] Error:", err);
    res.status(500).json({ msg: "Failed to fetch users" });
  }
});

// --------------------  Route 2: Get all bookings --------------------
router.get("/bookings", verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "title" },
          { path: "theater", select: "name" },
        ],
      })
      .populate("seats");

    const formatted = bookings.flatMap((b) => //all objcet element in bookings collections
      b.seats.map((seat) => ({
        movie: b.show?.movie?.title || "N/A",
        theater: b.show?.theater?.name || "N/A",
        showTime: b.show?.showTime || "N/A",// checks if b.show exists if yes then access its showtime or else N/A
        seatNumber: seat?.seatNumber || "N/A",
        userName: b.user?.name || "N/A",
        userEmail: b.user?.email || "N/A",
      }))
    );

    res.json(formatted);
  } catch (err) {
    console.error(" [GET /bookings] Error:", err);
    res.status(500).json({ msg: "Failed to fetch bookings" });
  }
});

// --------------------  Route 3: Get bookings for specific show --------------------
router.get("/show/:showId/bookings", verifyAdmin, async (req, res) => {
  try {
    const { showId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(showId)) return res.status(400).json({ msg: "Invalid show ID" });

    const seats = await Seat.find({ show: showId, isBooked: true }).lean();
    const show = await Show.findById(showId).populate("movie", "title").populate("theater", "name").lean();

    const userIds = seats.map((s) => s.userId).filter(Boolean);
    const users = await User.find({ _id: { $in: userIds } }, "name email").lean();

    const userMap = {};
    users.forEach((u) => (userMap[u._id.toString()] = u));

    const bookings = seats.map((seat) => {
      const user = userMap[seat.userId] || {};
      return {
        seatNumber: seat.seatNumber,
        userName: user.name || "N/A",
        userEmail: user.email || "N/A",
        movie: show?.movie?.title || "N/A",
        theater: show?.theater?.name || "N/A",
        showTime: show?.showTime || "N/A",
      };
    });

    res.json(bookings);
  } catch (err) {
    console.error(" [GET /show/:showId/bookings] Error:", err);
    res.status(500).json({ msg: "Failed to fetch show bookings" });
  }
});

// --------------------  Route 4: Add new movie --------------------
router.post("/movie", verifyAdmin, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.json({ msg: "Movie added", movie });
  } catch (err) {
    console.error(" [POST /movie] Error:", err);
    res.status(500).json({ msg: "Failed to add movie" });
  }
});

// --------------------  Route 5: Add new theater --------------------
router.post("/theater", verifyAdmin, async (req, res) => {
  try {
    const { name, location } = req.body;
    const theater = new Theater({ name, location });
    await theater.save();
    res.json({ msg: "Theater added", theater });
  } catch (err) {
    console.error(" [POST /theater] Error:", err);
    res.status(500).json({ msg: "Failed to add theater" });
  }
});

// --------------------  Route 6: Add show + generate seats together (for a brand new show creation) --------------------
router.post("/show", verifyAdmin, async (req, res) => {
  try {
    const { movie, theater, showTime } = req.body;
    if (!movie || !theater || !showTime) return res.status(400).json({ msg: "Missing show data" });

    const show = new Show({ movie, theater, showTime });
    await show.save();

    const seats = await createSeatsForShow(show._id);

    res.json({ msg: "Show and seats added", show, seatCount: seats.length });
  } catch (err) {
    console.error(" [POST /show] Error:", err);
    res.status(500).json({ msg: "Failed to add show" });
  }
});

// --------------------  Route 7: Generate (or regenerate) seats for a show if already exist --------------------
router.post("/seats/:showId", verifyAdmin, async (req, res) => {
  try {
    const { showId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(showId)) return res.status(400).json({ msg: "Invalid show ID" });

    await Seat.deleteMany({ show: showId }); // optional: clear existing
    const seats = await createSeatsForShow(showId);

    res.json({ msg: `Generated ${seats.length} seats`, seats });
  } catch (err) {
    console.error(" [POST /seats/:showId] Error:", err);
    res.status(500).json({ msg: "Failed to generate seats" });
  }
});
// --------------------  Route 8: Delete a show --------------------
router.delete("/show/:showId", verifyAdmin, async (req, res) => {
  try {
    const { showId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(showId)) return res.status(400).json({ msg: "Invalid show ID" });

    await Seat.deleteMany({ show: showId }); // clean up seats
    const deletedShow = await Show.findByIdAndDelete(showId);

    if (!deletedShow) return res.status(404).json({ msg: "Show not found" });

    res.json({ msg: "Show deleted successfully", deletedShow });
  } catch (err) {
    console.error(" [DELETE /show/:showId] Error:", err);
    res.status(500).json({ msg: "Failed to delete show" });
  }
});
// --------------------  Route 9: Delete a movie --------------------
router.delete("/movie/:movieId", verifyAdmin, async (req, res) => {
  try {
    const { movieId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(movieId)) return res.status(400).json({ msg: "Invalid movie ID" });

    // Optional: check if movie is used in any shows
    const associatedShows = await Show.findOne({ movie: movieId });
    if (associatedShows) {
      return res.status(400).json({ msg: "Cannot delete. Movie is used in a show." });
    }

    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    if (!deletedMovie) return res.status(404).json({ msg: "Movie not found" });

    res.json({ msg: "Movie deleted successfully", deletedMovie });
  } catch (err) {
    console.error(" [DELETE /movie/:movieId] Error:", err);
    res.status(500).json({ msg: "Failed to delete movie" });
  }
});


module.exports = router;
/*| **Frontend (React)**                                            | **Backend (Express)**                                                                                        |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Sends HTTP requests using **Axios** or **fetch** to the backend | Defines **API endpoints** using Express (`router.get`, `router.post`, etc.) to **respond to those requests** |
 */