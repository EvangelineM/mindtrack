const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerAScore = 0;
let playerBScore = 0;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 3.5;
let ballSpeedY = 3.5;
let leftPaddleY = (canvas.height - 100) / 2;
let rightPaddleY = (canvas.height - 100) / 2;
let paddleHeight = 100;
let paddleWidth = 10;
let leftPaddleSpeed = 0;
let rightPaddleSpeed = 0;
let gameStarted = false;
let difficulty = "normal";

// Select difficulty
document.getElementById("difficulty").addEventListener("change", (e) => {
    difficulty = e.target.value;
    setDifficulty();
});

function setDifficulty() {
    switch (difficulty) {
        case "easy":
            ballSpeedX = 2;
            ballSpeedY = 2;
            rightPaddleSpeed = 3;
            break;
        case "normal":
            ballSpeedX = 3.5;
            ballSpeedY = 3.5;
            rightPaddleSpeed = 5;
            break;
        case "difficult":
            ballSpeedX = 5;
            ballSpeedY = 5;
            rightPaddleSpeed = 7;
            break;
    }
}

document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("reset-game").addEventListener("click", resetGame);
document.getElementById("end-game").addEventListener("click", endGame);

document.addEventListener("keydown", (e) => {
    if (e.key === "w") leftPaddleSpeed = -8;
    if (e.key === "s") leftPaddleSpeed = 8;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "s") leftPaddleSpeed = 0;
});

function startGame() {
    gameStarted = true;
    document.getElementById("game-guide").style.display = "none";
    setDifficulty();
    updateGame();
}

function resetGame() {
    playerAScore = 0;
    playerBScore = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 3.5;
    ballSpeedY = 3.5;
    leftPaddleY = (canvas.height - 100) / 2;
    rightPaddleY = (canvas.height - 100) / 2;
    updateScore();
    gameStarted = false;
    document.getElementById("game-guide").style.display = "block";
}

function endGame() {
    gameStarted = false;
    alert("Game Over!");
}

function updateScore() {
    document.getElementById("player-a-score").innerText = `Player A: ${playerAScore}`;
    document.getElementById("player-b-score").innerText = `Player B: ${playerBScore}`;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function drawPaddles() {
    ctx.beginPath();
    ctx.rect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) ballSpeedY = -ballSpeedY;

    // Ball collision with paddles
    if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds
    if (ballX - ballRadius < 0) {
        playerBScore++;
        updateScore();
        resetBall();
    }
    if (ballX + ballRadius > canvas.width) {
        playerAScore++;
        updateScore();
        resetBall();
    }
}

function movePaddles() {
    leftPaddleY += leftPaddleSpeed;
    if (leftPaddleY < 0) leftPaddleY = 0;
    if (leftPaddleY + paddleHeight > canvas.height) leftPaddleY = canvas.height - paddleHeight;

    // AI for right paddle
    if (rightPaddleY + paddleHeight / 2 < ballY) rightPaddleY += rightPaddleSpeed;
    if (rightPaddleY + paddleHeight / 2 > ballY) rightPaddleY -= rightPaddleSpeed;
    if (rightPaddleY < 0) rightPaddleY = 0;
    if (rightPaddleY + paddleHeight > canvas.height) rightPaddleY = canvas.height - paddleHeight;
}

function updateGame() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddles();
    moveBall();
    movePaddles();

    requestAnimationFrame(updateGame);
}
