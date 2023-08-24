const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const initialSnakeLength = 5;

let snake = [{x: 0, y: 0}];
let food = generateFoodPosition();
let direction = 'right';
let speed = 100;
let isMoving = false;
let score = 0;

function generateFoodPosition() {
  const maxX = canvas.width / gridSize;
  const maxY = canvas.height / gridSize;
  return {
    x: Math.floor(Math.random() * maxX) * gridSize,
    y: Math.floor(Math.random() * maxY) * gridSize
  };
}

function drawSnake() {
  ctx.fillStyle = '#3498db'; // Azul florescente
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = '#e74c3c'; // Rosa florescente
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function playSound(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

function moveSnake() {
  const newHead = { ...snake[0] };

  if (direction === 'right') {
    newHead.x += gridSize;
  } else if (direction === 'left') {
    newHead.x -= gridSize;
  } else if (direction === 'up') {
    newHead.y -= gridSize;
  } else if (direction === 'down') {
    newHead.y += gridSize;
  }

  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    food = generateFoodPosition();
    speed -= 2;
    score++;
    document.querySelector('.score').innerText = `Score: ${score}`;
    playSound(''); // Toca o som de "uou"
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function gameLoop() {
  if (checkCollision()) {
    isMoving = false;
    alert('Game Over');
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveSnake();
  drawFood();
  drawSnake();

  if (isMoving) {
    setTimeout(gameLoop, speed);
  }
}

document.getElementById('startButton').addEventListener('click', () => {
  isMoving = true;
  score = 0;
  document.querySelector('.score').innerText = 'Score: 0';
  gameLoop();
});

document.getElementById('restartButton').addEventListener('click', () => {
  snake = [{x: 0, y: 0}];
  food = generateFoodPosition();
  direction = 'right';
  speed = 100;
  isMoving = true;
  score = 0;
  document.querySelector('.score').innerText = 'Score: 0';
  gameLoop();
});

document.addEventListener('keydown', (event) => {
  if (!isMoving) {
    isMoving = true;
    gameLoop();
  }

  const key = event.key;

  if ((key === 'ArrowRight' || key === 'd') && direction !== 'left') {
    direction = 'right';
  } else if ((key === 'ArrowLeft' || key === 'a') && direction !== 'right') {
    direction = 'left';
  } else if ((key === 'ArrowUp' || key === 'w') && direction !== 'down') {
    direction = 'up';
  } else if ((key === 'ArrowDown' || key === 's') && direction !== 'up') {
    direction = 'down';
  }
});
