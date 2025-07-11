import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; 
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/movies" className="nav-logo">🎬 BookFlixNow</Link>
        {token && (
          <Link to="/mybookings" className="nav-link">My Bookings</Link>
        )}
      </div>

      <div className="nav-right">
        {token ? (
          <button onClick={handleLogout} className="nav-button">Logout</button>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
