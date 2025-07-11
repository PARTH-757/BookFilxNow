import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./MovieDetails.css";

function getEmbedUrl(trailerUrl) {
  if (!trailerUrl) return null;
  let videoId = "";

  if (trailerUrl.includes("youtu.be/")) {
    videoId = trailerUrl.split("youtu.be/")[1].split("?")[0];
  } else if (trailerUrl.includes("watch?v=")) {
    videoId = trailerUrl.split("watch?v=")[1].split("&")[0];
  } else if (trailerUrl.includes("embed/")) {
    // Already an embed link
    return trailerUrl;
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/movies/${id}`)
      .then((res) => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch movie:", err);
        setError("Could not load movie details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="center-text">⏳ Loading movie details...</p>;
  if (error) return <p className="center-text error">{error}</p>;
  if (!movie) return <p className="center-text">Movie not found</p>;

  return (
    <div className="movie-details">
      {movie.trailer && (// renders only if trailer exists
        <div className="trailer-wrapper">
          <div className="video-container">
            <iframe
              src={getEmbedUrl(movie.trailer)}
              title="Trailer"
              frameBorder="0"// Removes the default border around the iframe (browser styling quirk).
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              //autoplay: start automaticallyclipboard-write: allow copyingencrypted-media: allow encrypted playback (e.g. DRM protected viideos are also played)picture-in-picture: let users pop the video out into a mini-window
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p className="description">{movie.description}</p>
        <p><strong>Genre:</strong> {movie.genre}</p>
        <p><strong>Rating:</strong> ⭐ {movie.rating}/10</p>
        <p><strong>Location:</strong> {movie.location}</p>
        <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toDateString()}</p>
        <Link to={`/book/${movie._id}`} className="book-button">
          🎟️ Book Now
        </Link>
        
      </div>
    </div>
  );
}

export default MovieDetails;
