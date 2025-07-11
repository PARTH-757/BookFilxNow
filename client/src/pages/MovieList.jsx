import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../components/MovieList.css";

// Base API URL from environment or fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://bookfilxnow-backend.onrender.com";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);     

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/movies`)
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setError("⚠️ Failed to load movies. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="center-text">⏳ Loading movies...</p>;
  if (error) return <p className="center-text error">{error}</p>;

  return (
    <div className="movie-list">
      <h2>🎬 Now Showing</h2>
      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <img src={movie.image} alt={movie.title} />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>⭐ {movie.rating}/10</p>
              <Link to={`/movies/${movie._id}`} className="details-link">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
