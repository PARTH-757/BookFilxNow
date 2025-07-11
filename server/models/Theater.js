const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
  name: String,
  location: String
});

module.exports = mongoose.model("Theater", theaterSchema);
/* Breakdown of this line:
js

module.exports = mongoose.model("Theater", theaterSchema);
This line does two things:

It creates a Mongoose model called "Theater" based on the theaterSchema.

It exports the model so it can be used in other files.

*/
