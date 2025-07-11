import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./AuthPage.css";

// You can set this in a .env file like:
// REACT_APP_API_BASE_URL=https://bookfilxnow-backend.onrender.com
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://bookfilxnow-backend.onrender.com";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        <div className="auth-heading">
          <h1>
            Welcome to <span>BookFlixNow</span>
          </h1>
          <p>
            Make the immersive experience of silverscreen even more special and
            convenient
          </p>
        </div>

        <div className="auth-form">
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  Logging in...
                  <span className="spinner"></span>
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
