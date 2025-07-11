import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MovieList from "./pages/MovieList";
import MovieDetails from "./pages/MovieDetails";
import BookShowtimes from "./pages/BookShowtimes";
import SeatSelection from "./pages/SeatSelection";
import LoginPage from "./pages/LoginPage";       
import SignupPage from "./pages/SignupPage";     
import MyBookings from "./pages/MyBookings";     
import Navbar from "./components/Navbar";        
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage"
import AdminPage from "./pages/AdminPage";
import AdminMain from "./pages/AdminMain";






function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Navbar /> {/* ✅ Show on all pages */}

      <Routes>
        {/* 🏠 Default redirect */}
        <Route path="/" element={<Navigate to="/movies" replace />} />

        {/* 🎬 Movies */}
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetails />} />

        {/*payment */}
        <Route path="/payment" element={<PaymentPage />} />


        {/* 🎟️ Booking */}
        <Route path="/book/:movieId" element={<BookShowtimes />} />
        <Route path="/book/:showId/seats" element={<SeatSelection />} />

        {/* 🔐 Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 👤 Protected: My Bookings */}
        <Route
          path="/mybookings"
          element={token ? <MyBookings /> : <Navigate to="/login" replace />}
        />

        {/*confirmation page */}
        <Route path="/confirmation" element={<ConfirmationPage />} />


       

        {/* Add route:*/}
        <Route path="/admin" element={<AdminMain />} />
      </Routes>
    </Router>
  );
}

export default App;
