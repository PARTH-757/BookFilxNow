const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔐 CORS: Allow frontend to talk to backend
app.use(cors({
  origin: "https://bookflixnow.vercel.app", // ✅ your Vercel frontend URL
  credentials: true,
}));

// ✅ Allow custom headers like x-auth-token
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-auth-token, Origin, Content-Type, Accept");
  next();
});

// ✅ Middlewares
app.use(express.json()); // replaces bodyParser.json()
app.use(morgan("dev"));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/bookmyshow-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🎉 Backend is working!");
});

// ✅ Mount Routes
app.use("/api/auth", require("./models/routes/auth"));
app.use("/api/admin", require("./models/routes/admin"));
app.use("/api/receipt", require("./models/routes/receipt"));
app.use("/api/theaters", require("./models/routes/theaterRoutes"));
app.use("/api/movies", require("./models/routes/movieRoutes"));
app.use("/api/seats", require("./models/routes/seatRoutes"));
app.use("/api/shows", require("./models/routes/showRoutes"));
app.use("/api/bookings", require("./models/routes/bookingRoutes"));

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
