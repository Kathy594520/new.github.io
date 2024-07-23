let canvas, ctx;
let balls = [];
let cat = { x: 0, y: 0, width: 100, height: 100, speed: 2, dx: 0, dy: 0 }; // 初始大小
let score = 0;
let isGameRunning = false;
let gameInterval;
let speedMultiplier = 1;
let ballImg, catImg;

function startGame() {
    const playerName = document.getElementById('playerName').value;
    if (!playerName) {
        alert('請輸入玩家名稱');
        return;
    }
    speedMultiplier = parseInt(document.getElementById('speed').value);
    resetGame();
    isGameRunning = true;
    document.getElementById('bgMusic').play();
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    setTimeout(endGame, 60000); // 60 seconds game duration
}

function resetGame() {
    balls = [];
    for (let i = 0; i < 5; i++) { // 隨機生成 5 個毛線球
        let ball = {
            x: Math.random() * (canvas.width - 200) + 100, // 增加毛線球圖像大小的邊界調整
            y: Math.random() * (canvas.height - 200) + 100, // 增加毛線球圖像大小的邊界調整
            radius: Math.min(canvas.width, canvas.height) / 20, // 根據畫布寬度動態設置大小
            speedX: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
            speedY: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1)
        };
        balls.push(ball);
    }
    const catSize = Math.min(canvas.width, canvas.height) / 8; // 放大貓的大小
    cat.width = catSize;
    cat.height = catSize;
    cat.x = canvas.width / 2;
    cat.y = canvas.height / 2;
    cat.dx = 0;
    cat.dy = 0;
    score = 0;
    document.getElementById('score').innerText = score;
    if (!isGameRunning) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    }
}

function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    document.getElementById('bgMusic').pause();
    document.getElementById('bgMusic').currentTime = 0;
    alert(`遊戲結束！您的分數是：${score}`);
}

function gameLoop() {
    if (!isGameRunning) return;
    moveBalls();
    moveCat();
    detectCollision();
    drawGame();
}

function moveBalls() {
    balls.forEach(ball => {
        ball.x += ball.speedX * speedMultiplier;
        ball.y += ball.speedY * speedMultiplier;
        if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.speedX = -ball.speedX;
        if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) ball.speedY = -ball.speedY;
    });
}

function moveCat() {
    cat.x += cat.dx * cat.speed * speedMultiplier;
    cat.y += cat.dy * cat.speed * speedMultiplier;
    if (cat.x - cat.width / 2 < 0) cat.x = cat.width / 2;
    if (cat.x + cat.width / 2 > canvas.width) cat.x = canvas.width - cat.width / 2;
    if (cat.y - cat.height / 2 < 0) cat.y = cat.height / 2;
    if (cat.y + cat.height / 2 > canvas.height) cat.y = canvas.height - cat.height / 2;
}

function detectCollision() {
    balls.forEach(ball => {
        const dx = ball.x - cat.x;
        const dy = ball.y - cat.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ball.radius + cat.width / 2) {
            score++;
            document.getElementById('score').innerText = score;
            document.getElementById('meowSound').play();
            // Remove the ball that was caught
            balls.splice(balls.indexOf(ball), 1);
            // Add a new ball
            let newBall = {
                x: Math.random() * (canvas.width - 200) + 100,
                y: Math.random() * (canvas.height - 200) + 100,
                radius: Math.min(canvas.width, canvas.height) / 20,
                speedX: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
                speedY: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1)
            };
            balls.push(newBall);
        }
    });
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        ctx.drawImage(ballImg, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    });
    ctx.drawImage(catImg, cat.x - cat.width / 2, cat.y - cat.height / 2, cat.width, cat.height);
    ctx.fillStyle = 'black';
    ctx.fillText(`分數: ${score}`, 10, 20);
}

function moveCatUp() {
    cat.dx = 0;
    cat.dy = -1;
}

function moveCatDown() {
    cat.dx = 0;
    cat.dy = 1;
}

function moveCatLeft() {
    cat.dx = -1;
    cat.dy = 0;
}

function moveCatRight() {
    cat.dx = 1;
    cat.dy = 0;
}

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    resetGame();
}

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ballImg = new Image();
    ballImg.src = 'ball.png'; // 確保圖像文件已經存在
    catImg = new Image();
    catImg.src = 'cat.png'; // 確保圖像文件已經存在
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.getElementById('bgMusic').addEventListener('ended', endGame);
};
