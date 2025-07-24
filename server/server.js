const express = require("express");
const mongoose = require("mongoose");

const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT ;

//  Middleware
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());

//  MongoDB Connection
mongoose.connect(process.env.MONGO_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" Mongo Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working ");
});

//  Mount routes
const seatRoutes = require("./models/routes/seatRoutes");  
const movieRoutes = require("./models/routes/movieRoutes");
const showRoutes = require("./models/routes/showRoutes");
const receiptRoutes = require("./models/routes/receipt");
const adminRoutes = require("./models/routes/admin");
const authRoutes = require("./models/routes/auth");
const theaterRoutes = require("./models/routes/theaterRoutes"); 




app.use("/api/theaters", theaterRoutes);
app.use("/api/auth", authRoutes);// better than app.use("/api/auth", require("./models/routes/auth")); due to readability
app.use("/api/admin", adminRoutes);
app.use("/api/receipt", receiptRoutes);

app.use("/api/bookings", require("./models/routes/bookingRoutes")); 

app.use("/api/seats", seatRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);


//  Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
