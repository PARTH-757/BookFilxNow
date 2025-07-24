const express = require("express");
const router = express.Router();
const Movie = require("../Movie");

//this function makes embedded url from trailers but i usually put pre embedded links
function getEmbedUrl(trailerUrl) {
  if (!trailerUrl) return null;
  let videoId = "";

  // Case 1: youtu.be/<id> when link is https://youtu.be/abcd1234 This splits the string at "youtu.be/". ["https://", "abc123DEF?autoplay=1"], [1] gives you:, "abc123DEF?autoplay=1"
  if (trailerUrl.includes("youtu.be/")) {
    videoId = trailerUrl.split("youtu.be/")[1].split("?")[0];
  }
  // Case 2: youtube.com/watch?v=<id> when link is like  https://www.youtube.com/watch?v=abcd1234
  else if (trailerUrl.includes("watch?v=")) {
    videoId = trailerUrl.split("watch?v=")[1].split("&")[0];
  }

  return `https://www.youtube.com/embed/${videoId}`;
}


//  GET /api/movies - Fetch all movies with optional filters
//gets movie data from server database and allows filtering based on location,  genre and date
router.get("/", async (req, res) => {
  try {
    const { location, genre, date } = req.query; 

    let query = {};
    if (location) query.location = location;
    if (genre) query.genre = genre;
    if (date) query.releaseDate = { $gte: new Date(date) };

    const movies = await Movie.find(query);
    res.json(movies);//add movies at the end of link localhost:5000/api and adds the movies in a json format
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

//  GET /api/movies/:id - Fetch a single movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

module.exports = router;
