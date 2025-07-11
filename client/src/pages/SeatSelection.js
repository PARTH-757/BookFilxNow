import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 
import "./SeatSelection.css";

function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [userId, setUserId] = useState(null);

  // On mount: decode token to get userId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id || decoded._id); // backend should send id or _id in token
      } catch (err) {
        console.error("Invalid token:", err);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  const fetchSeats = () => {
    axios
      .get(`http://localhost:5000/api/shows/${showId}/seats`)
      .then((res) => setSeats(res.data))
      .catch((err) => console.error("Error fetching seats:", err));
  };

  useEffect(() => {
    fetchSeats();
  }, [showId]);

  const toggleSelect = (seatId) => {
    if (!userId) {
      alert("Please log in to select seats.");
      navigate("/login");
      return;
    }
    setSelected((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

const handlePaymentRedirect = () => {
  navigate("/payment", {
    state: {
      seatIds: selected,
      userId,
      showId,
    },
  });
};

  const cancelSeats = () => {
    axios
      .post("http://localhost:5000/api/seats/cancel", {
        seatIds: selected,
        userId,
      })
      .then(() => {
        setSelected([]);
        fetchSeats();
        alert("❌ Booking canceled");
      })
      .catch((err) => {
        console.error("Cancel failed:", err);
        alert("❌ Cancel failed");
      });
  };

  return (
    <div className="seat-container">
      <h2>Select Your Seats</h2>

      {/* Legends */}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-box available" /> Available
        </div>
        <div className="legend-item">
          <div className="legend-box selected" /> Selected
        </div>
        <div className="legend-item">
          <div className="legend-box booked" /> Booked
        </div>
      </div>

      {/* Seat Grid */}
      <div className="seat-grid">
        {seats.map((seat) => {
          const isSelected = selected.includes(seat._id);
          const className = seat.isBooked
            ? "seat booked"
            : isSelected
            ? "seat selected"
            : "seat available";

          return (
            <button
              key={seat._id}
              className={className}
              onClick={() => !seat.isBooked && toggleSelect(seat._id)}
              disabled={seat.isBooked}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>

      {/* Screen Display */}
      <div className="screen"></div>
      <div className="screen-text">All eyes this way please!</div>

      {/* Action Buttons */}
      <div className="button-group">
        <button
        id="selection2"
        onClick={handlePaymentRedirect}
        disabled={selected.length === 0 || !userId}
          >
            💳 Proceed to Payment
          </button>

        <button
          id="selection1"
          onClick={cancelSeats}
          disabled={selected.length === 0 || !userId}
          className="cancel-btn"
        >
          ❌ Cancel Selected
        </button>
      </div>
    </div>
  );
}

export default SeatSelection;
