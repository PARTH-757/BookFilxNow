import React, { useState } from "react";
import AdminDashboard from "../components/AdminDashboard";
import AdminPage from "./AdminPage";
import "./AdminMain.css"; 

function AdminMain() {
  const [view, setView] = useState("dashboard");

  return (
    <div className="admin-main-container">
      <h2 className="admin-main-header"> Admin Panel</h2>

      <div className="admin-toggle-buttons">
        <button onClick={() => setView("dashboard")}> Add Movies/Theaters/Shows</button>
        <button onClick={() => setView("monitor")}> View Shows & Bookings</button>
      </div>

      <div className="admin-view-area">
        {view === "dashboard" ? <AdminDashboard /> : <AdminPage />}
      </div>
    </div>
  );
}

export default AdminMain;
