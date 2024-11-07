import React from "react";
import musicImage from "../../assets/images/music.jpg";
import "./music.css";
import { useNavigate } from "react-router-dom";

const Music = () => {
  const navigate = useNavigate();
  return (
    <section className="music">
      <div className="music-image">
        <img src={musicImage} alt="Music" />
      </div>
      <div className="music-content">
        <h2>Music</h2>
        <p>
          Relax and unwind with a selection of calming and therapeutic music.
          Find playlists and tracks to help manage stress and enhance your mood.
        </p>
        <button
          onClick={() => {
            navigate("/music");
          }}
        >
          Listen to Music
        </button>
      </div>
    </section>
  );
};

export default Music;
