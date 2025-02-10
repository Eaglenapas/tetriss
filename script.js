const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// Create the board
const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// Tetrominoes
const tetrominoes = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

// Randomly select a tetromino
function randomTetromino() {
  const keys = Object.keys(tetrominoes);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return tetrominoes[randomKey];
}

let piece = randomTetromino();
let position = { x: 3, y: 0 };

// Draw the board
function drawBoard() {
  context.fillStyle = '#34495e';
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = '#ecf0f1';
        context.fillRect(x, y, 1, 1);
      }
    });
  });
}

// Draw the current piece
function drawPiece() {
  piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = '#e74c3c';
        context.fillRect(x + position.x, y + position.y, 1, 1);
      }
    });
  });
}

// Collision detection
function collide() {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (
        piece[y][x] &&
        (board[y + position.y] && board[y + position.y][x + position.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

// Merge the piece into the board
function merge() {
  piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[y + position.y][x + position.x] = value;
      }
    });
  });
}

// Clear completed rows
function clearRows() {
  let rowsCleared = 0;
  board.forEach((row, y) => {
    if (row.every((cell) => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      rowsCleared++;
    }
  });
  if (rowsCleared > 0) {
    updateScore(rowsCleared);
  }
}

// Update the score
let score = 0;
function updateScore(lines) {
  score += lines * 10;
  document.getElementById('score').innerText = score;
}

// Move the piece down
function drop() {
  position.y++;
  if (collide()) {
    position.y--;
    merge();
    clearRows();
    piece = randomTetromino();
    position = { x: 3, y: 0 };
    if (collide()) {
      alert('Game Over!');
      board.forEach((row) => row.fill(0));
      score = 0;
      document.getElementById('score').innerText = score;
    }
  }
}

// Move the piece left or right
function move(dir) {
  position.x += dir;
  if (collide()) {
    position.x -= dir;
  }
}

// Rotate the piece
function rotate() {
  const prevPiece = piece;
  piece = piece[0].map((_, i) => piece.map((row) => row[i]).reverse());
  if (collide()) {
    piece = prevPiece;
  }
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    move(-1);
  } else if (event.key === 'ArrowRight') {
    move(1);
  } else if (event.key === 'ArrowDown') {
    drop();
  } else if (event.key === 'ArrowUp') {
    rotate();
  }
});

// Game loop
function update() {
  drawBoard();
  drawPiece();
  requestAnimationFrame(update);
}

// Start the game
setInterval(drop, 1000);
update();