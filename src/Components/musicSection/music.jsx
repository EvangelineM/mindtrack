import React, { useEffect, useState } from "react";
import axios from "axios";
import "./music.css"; // Import the new CSS file for styles

const MusicPlayer = ({ token, logout }) => {
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [searchType, setSearchType] = useState("artist");

  const search = async (e) => {
    e.preventDefault();
    if (!token) return; // Don't search if not logged in

    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: searchType,
        },
      });

      if (searchType === "artist") {
        setArtists(data.artists.items);
        setPlaylists([]);
      } else {
        setPlaylists(data.playlists.items);
        setArtists([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchArtistTracks = async (artistId) => {
    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            market: "US",
          },
        }
      );
      setCurrentTrack(data.tracks[0]);
    } catch (error) {
      console.error("Error fetching artist tracks:", error);
    }
  };

  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentTrack(data.items[0].track);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    }
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div
        key={artist.id}
        className="artist-card"
        onClick={() => fetchArtistTracks(artist.id)}
      >
        {artist.images.length ? (
          <img
            className="artist-image"
            src={artist.images[0].url}
            alt={artist.name}
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
        <p className="artist-name">{artist.name}</p>
      </div>
    ));
  };

  const renderPlaylists = () => {
    return playlists.map((playlist) => (
      <div
        key={playlist.id}
        className="playlist-card"
        onClick={() => fetchPlaylistTracks(playlist.id)}
      >
        {playlist.images.length ? (
          <img
            className="playlist-image"
            src={playlist.images[0].url}
            alt={playlist.name}
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
        <p className="playlist-name">{playlist.name}</p>
      </div>
    ));
  };

  const AudioPlayer = () => {
    const audioRef = React.useRef(null);

    useEffect(() => {
      if (audioRef.current && currentTrack && currentTrack.preview_url) {
        audioRef.current.load();
      }
    }, [currentTrack]);

    if (!currentTrack || !currentTrack.preview_url) {
      return <p>No audio preview available for this track.</p>;
    }

    return (
      <div className="audio-player">
        <h3>
          Now Playing: {currentTrack.name} by{" "}
          {currentTrack.artists.map((artist) => artist.name).join(", ")}
        </h3>
        <audio controls ref={audioRef} className="audio-controller">
          <source src={currentTrack.preview_url} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  };

  return (
    <div className="music-player">
      {token ? (
        <>
          <div className="head">
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>

          <AudioPlayer />
          <form onSubmit={search} className="search-form">
            <input
              type="text"
              placeholder="Search for an artist or playlist"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="search-input"
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-select"
            >
              <option value="artist">Artist</option>
              <option value="playlist">Playlist</option>
            </select>
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
          <div className="results-container">
            {searchType === "artist" ? renderArtists() : renderPlaylists()}
          </div>
        </>
      ) : (
        <div className="login-prompt">
          <h2>You are not logged in.</h2>
          <a
            href={`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token`}
            className="login-link"
          >
            Login to Spotify
          </a>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
