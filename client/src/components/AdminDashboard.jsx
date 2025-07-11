import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [movieData, setMovieData] = useState({
    title: "",
    description: "",
    genre: "",
    rating: "",
    location: "",
    image: "",
    releaseDate: "",
    trailer: "",
  });

  const [theaterData, setTheaterData] = useState({
    name: "",
    location: "",
  });

  const [showData, setShowData] = useState({
    movie: "",
    theater: "",
    showTime: "",
  });

  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = process.env.REACT_APP_BACKEND_URL;
        const [m, t, s] = await Promise.all([
          axios.get(`${baseURL}/api/movies`),
          axios.get(`${baseURL}/api/theaters`),
          axios.get(`${baseURL}/api/shows`),
        ]);
        setMovies(m.data);
        setTheaters(t.data);
        setShows(s.data);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/movie`, movieData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Movie Added");
    } catch (err) {
      console.error("❌ Error adding movie:", err);
      alert("❌ Failed to add movie");
    }
  };

  const handleTheaterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/theater`, theaterData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Theater Added");
    } catch (err) {
      console.error("❌ Error adding theater:", err);
      alert("❌ Failed to add theater");
    }
  };

  const handleShowSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/show`, showData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Show Created");
    } catch (err) {
      console.error("❌ Error adding show:", err);
      alert("❌ Failed to add show");
    }
  };

  const handleDeleteShow = async () => {
    if (!selectedShowId) return alert("❗Please select a show to delete");
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/show/${selectedShowId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Show deleted");
      setShows(shows.filter((s) => s._id !== selectedShowId));
      setSelectedShowId("");
    } catch (err) {
      console.error("❌ Error deleting show:", err);
      alert("❌ Failed to delete show");
    }
  };

  const handleDeleteMovie = async () => {
    if (!selectedMovieId) return alert("❗Please select a movie to delete");
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/movie/${selectedMovieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Movie deleted");
      setMovies(movies.filter((m) => m._id !== selectedMovieId));
      setSelectedMovieId("");
    } catch (err) {
      console.error("❌ Error deleting movie:", err);
      alert("❌ Failed to delete movie");
    }
  };

  return (
    <div className="admin-dashboard">
      <h3>🎞️ Add Movie</h3>
      <form onSubmit={handleMovieSubmit}>
        {Object.keys(movieData).map((field) => (
          <input
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={movieData[field]}
            onChange={(e) => setMovieData({ ...movieData, [field]: e.target.value })}
          />
        ))}
        <button type="submit">Add Movie</button>
      </form>

      <h3>🏢 Add Theater</h3>
      <form onSubmit={handleTheaterSubmit}>
        <input placeholder="Theater Name" value={theaterData.name} onChange={(e) => setTheaterData({ ...theaterData, name: e.target.value })} />
        <input placeholder="Location" value={theaterData.location} onChange={(e) => setTheaterData({ ...theaterData, location: e.target.value })} />
        <button type="submit">Add Theater</button>
      </form>

      <h3>⏰ Add Show</h3>
      <form onSubmit={handleShowSubmit}>
        <select value={showData.movie} onChange={(e) => setShowData({ ...showData, movie: e.target.value })}>
          <option value="">--Select Movie--</option>
          {movies.map((m) => <option key={m._id} value={m._id}>{m.title}</option>)}
        </select>

        <select value={showData.theater} onChange={(e) => setShowData({ ...showData, theater: e.target.value })}>
          <option value="">--Select Theater--</option>
          {theaters.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>

        <input type="datetime-local" value={showData.showTime} onChange={(e) => setShowData({ ...showData, showTime: e.target.value })} />
        <button type="submit">Add Show</button>
      </form>

      <h3>🗑️ Delete Show</h3>
      <select value={selectedShowId} onChange={(e) => setSelectedShowId(e.target.value)}>
        <option value="">-- Select Show --</option>
        {shows.map((s) => (
          <option key={s._id} value={s._id}>
            {s.movie?.title} @ {s.theater?.name} - {new Date(s.showTime).toLocaleString()}
          </option>
        ))}
      </select>
      <button onClick={handleDeleteShow}>Delete Show</button>

      <h3>🗑️ Delete Movie</h3>
      <select value={selectedMovieId} onChange={(e) => setSelectedMovieId(e.target.value)}>
        <option value="">-- Select Movie --</option>
        {movies.map((m) => (
          <option key={m._id} value={m._id}>{m.title}</option>
        ))}
      </select>
      <button onClick={handleDeleteMovie}>Delete Movie</button>
    </div>
  );
}

export default AdminDashboard;
