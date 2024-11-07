import React from 'react';
import './games.css'; // Import the styling
import Navbar from '../navbar';

const Games = () => {

    const droiddefense = () => {
        window.location.href = '/droid-defense-master/index.html'; // Access the HTML page from the root
    };

    const sequencesafari = () => {
        window.location.href = '/sequence-safari-master/index.html'; // Access the HTML page from the root
    };

    const bubbleShooter = () => {
        window.location.href = '/bubble-shooter-game/bubble-shooter.html'; // Access the HTML page from the root
    };

    const pingpong = () => {
        window.location.href = '/pingpong/index.html'; // Access the HTML page from the root
    };

    return (
        <>
            <Navbar />
            <div className="games-page">
                <h1>Games</h1>
                <div className="game-container">
                    <div className="game-card">
                        <h2>Ping Pong</h2>
                        {/* Ping Pong game could be added here */}
                        <button onClick={pingpong}>Play Ping Pong</button>
                    </div>
                    <div className="game-card">
                        <h2>Alien Shooter</h2>
                        {/* Redirect to the Alien Shooter game */}
                        <button onClick={droiddefense}>Play Alien Shooter</button>
                    </div>
                    <div className="game-card">
                        <h2>Sequence Snake</h2>
                        {/* Redirect to the Sequence Snake game */}
                        <button onClick={sequencesafari}>Play Sequence Safari</button>
                    </div>
                    <div className="game-card">
                        <h2>Bubble Shooter</h2>
                        {/* Redirect to the Sequence Snake game */}
                        <button onClick={bubbleShooter}>Play Bubble Shooter</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Games;
