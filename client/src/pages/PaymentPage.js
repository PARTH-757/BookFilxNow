import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentPage.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://bookfilxnow-backend.onrender.com";

function PaymentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { seatIds, userId, showId } = state || {};

  const amount = seatIds.length * 200; // ₹200 per seat

  const handlePayment = async () => {
    try {
      // Step 1: Book the seats
      await axios.post(`${API_BASE_URL}/api/seats/book`, {
        seatIds,
        userId,
      });

      // Step 2: Send email receipt
      await axios.post(`${API_BASE_URL}/api/receipt/send`, {
        userId,
        seatIds,
        showId,
        amount,
      });

      // Step 3: Redirect to confirmation
      navigate("/confirmation");
    } catch (err) {
      alert("❌ Payment or Booking failed.");
      console.error("Payment error:", err);
    }
  };

  if (!seatIds || !userId || !showId) {
    return <div>Error: Missing booking data.</div>;
  }

  return (
    <div className="payment-page" style={{ padding: "2rem", textAlign: "center" }}>
      <h2>💳 Complete Your Payment</h2>
      <p><strong>Seats:</strong> {seatIds.join(", ")}</p>
      <p><strong>Total Amount:</strong> ₹{amount}</p>
      <button onClick={handlePayment} style={{ padding: "10px 20px", marginTop: "1rem" }}>
        ✅ Pay Now
      </button>
    </div>
  );
}

export default PaymentPage;
