const LoginPrompt = () => {
  const CLIENT_ID = "a7c67ee676bd4fe29a8542700da624bd";
  const REDIRECT_URI = "https://mindtrackk.vercel.app/music"; // Ensure redirect URI matches in Spotify dev portal
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  return (
    <div className="login-prompt">
      <h2>Please log in to access the music player.</h2>
      <a
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        className="login-link"
      >
        Login to Spotify
      </a>
    </div>
  );
};

export default LoginPrompt;
