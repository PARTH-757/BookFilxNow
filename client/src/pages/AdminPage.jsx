import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPage.css"; 
function AdminPage() {
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchShows = async () => {
      const res = await axios.get("http://localhost:5000/api/shows", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShows(res.data);
    };
    fetchShows();
  }, []);

  const fetchBookings = async (showId) => {
    setSelectedShowId(showId);
    const res = await axios.get(`http://localhost:5000/api/admin/show/${showId}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBookings(res.data);
  };

  return (
    <div className="admin-page-container">
      <h2> Shows List</h2>
      <table className="shows-table">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Theater</th>
            <th>Show Time</th>
            <th>Bookings</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <tr key={show._id}>
              <td>{show.movie.title}</td>
              <td>{show.theater.name}</td>
              <td>{new Date(show.showTime).toLocaleString()}</td>
              <td>
                <button className="view-btn" onClick={() => fetchBookings(show._id)}>
                  View Bookings
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedShowId && (
        <>
          <h3> Booked Seats for Selected Show</h3>
          {bookings.length === 0 ? (
            <p>No bookings for this show.</p>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Seat</th>
                  <th>Movie</th>
                  <th>Theater</th>
                  <th>Show Time</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={i}>
                    <td>{b.seatNumber}</td>
                    <td>{b.movie}</td>
                    <td>{b.theater}</td>
                    <td>{new Date(b.showTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPage;
