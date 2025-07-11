// client/src/pages/MyBookings.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await axios.get("http://localhost:5000/api/booking/mybookings", {
          headers: {
            "x-auth-token": localStorage.getItem("token")
          }
        });
        setBookings(res.data);
      } catch (err) {
        alert("Failed to fetch bookings");
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="container">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((b, i) => (
            <li key={i}>
              🎬 Movie: {b.show.movie.title} <br />
              🕒 Time: {new Date(b.show.showTime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyBookings;
