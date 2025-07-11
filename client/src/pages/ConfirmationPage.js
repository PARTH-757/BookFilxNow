import React from "react";
import { Link } from "react-router-dom";
import "./ConfirmationPage.css";

function ConfirmationPage() {
  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h1>🎉 Booking Confirmed!</h1>
        <p>Thank you for booking with <strong>BookFlixNow</strong>.</p>
        <p>We’ve emailed your ticket receipt. Check your inbox </p>
        <Link to="/" className="home-button">Back to Home</Link>
      </div>
    </div>
  );
}

export default ConfirmationPage;  
