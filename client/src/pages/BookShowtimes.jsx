import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Use default import
import "./BookShowtimes.css";

function BookShowtimes() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Please login to view showtimes.");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded && (decoded.id || decoded._id)) {
        setIsAuthorized(true);
      } else {
        throw new Error("Invalid token");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    async function fetchShows() {
      try {
        const res = await axios.get(`http://localhost:5000/api/shows/movie/${movieId}`);
        setShows(res.data);

        if (res.data.length > 0) {
          setMovieTitle(res.data[0].movie.title);
        }
      } catch (err) {
        console.error("Error fetching shows:", err);
        setError("Could not fetch shows");
      }
    }

    if (isAuthorized) {
      fetchShows();
    }
  }, [movieId, isAuthorized]);

  const grouped = shows.reduce((acc, show) => {
    const tId = show.theater._id;
    if (!acc[tId]) {
      acc[tId] = {
        theaterName: show.theater.name,
        location: show.theater.location,
        shows: [],
      };
    }
    acc[tId].shows.push(show);
    return acc;
  }, {});

  if (error) return <p className="center-text error">{error}</p>;

  return (
    <div className="showtimes-container">
      <h2>Book Tickets for <span className="highlight">{movieTitle}</span></h2>
      {Object.values(grouped).map((group, i) => (
        <div className="theater-group" key={i}>
          <div className="theater-header">
            <h4>{group.theaterName}, {group.location}</h4>
            <div className="icons">
              <span>📱 M-Ticket</span>
              <span>🍿 Food & Beverage</span>
            </div>
          </div>

          <div className="showtimes-row">
            {group.shows.map(show => (
              <Link
                key={show._id}
                to={`/book/${show._id}/seats`}
                className="showtime-slot"
              >
                {new Date(show.showTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Link>
            ))}
          </div>

          <div className="cancellation-note">Cancellation available</div>
        </div>
      ))}
    </div>
  );
}

export default BookShowtimes;
