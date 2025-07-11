const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  rating: Number,
  genre: String,
  location: String,
  image: String,
  releaseDate: Date,
  trailer: String, 
});

module.exports = mongoose.model("Movie", movieSchema);
