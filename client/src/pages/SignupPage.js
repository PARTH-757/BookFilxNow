import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./AuthPage.css";

// ✅ Use env variable or fallback to deployed backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://bookfilxnow-backend.onrender.com";

function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        <div className="auth-heading">
          <h1>
            Welcome to <span>BookFlixNow</span>
          </h1>
          <p>Make the immersive experience of silverscreen even special and convenient</p>
        </div>

        <div className="auth-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
