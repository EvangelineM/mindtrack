import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Hero from "./Components/landingPage/hero";
import FeaturesSection from "./Components/landingPage/features";
import HowItWorks from "./Components/landingPage/how";
import Home from "./Components/homePage/home";
import Footer from "./Components/footer";
import Games from "./components/gamesSection/games";
import Journal from "./Components/journalSection/journal";
import MusicPlayer from "./Components/musicSection/music";
import LoginPrompt from "./Components/musicSection/LoginPrompt";
import "./App.css";

// Spotify API configuration
const CLIENT_ID = "a7c67ee676bd4fe29a8542700da624bd";
const REDIRECT_URI = "http://localhost:5173/music"; // Ensure redirect URI matches in Spotify dev portal
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, []);

  const logout = () => {
    window.localStorage.removeItem("token");
    setToken("");
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <FeaturesSection />
                <HowItWorks />
                <Footer />
              </>
            }
          />
          <Route path="/home" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/journal" element={<Journal />} />
          <Route
            path="/music"
            element={
              token ? (
                <MusicPlayer token={token} logout={logout} />
              ) : (
                <LoginPrompt />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
