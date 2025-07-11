import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./AuthPage.css";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });//  e.preventDefault();  Prevent form reload setLoading(true);    Disable button and show loading
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
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
          <h1>Welcome to <span>BookFlixNow</span></h1>
          <p>Make the immersive experience of silverscreen even special and convenient</p>
          
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
