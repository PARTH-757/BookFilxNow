const mongoose = require("mongoose");

//  This line registers the Theater model so that .populate("theater") works
require("./Theater"); 

// Define the Show schema
const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater" },
  showTime: Date
});

// Export the Show model
module.exports = mongoose.model("Show", showSchema);
