const size = 5;
let cells = [];
let initialFlips = [];
let movesLeft = 0;

function createGrid() {
  const container = document.getElementById('grid-container');

  for (let i = 0; i < size; i++) {
    cells[i] = [];
    for (let j = 0; j < size; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell'); // Initialize every cell as white
      cell.addEventListener('click', () => {
        if (movesLeft > 0) {
          flipCells(i, j);
          movesLeft--;
          updateMovesLeft();
          checkGameOver();
        }
      });
      container.appendChild(cell);
      cells[i][j] = cell;
    }
  }

  createNewGame();
}

function flipCells(i, j) {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      const ni = i + x;
      const nj = j + y;
      if (ni >= 0 && ni < size && nj >= 0 && nj < size) {
        cells[ni][nj].classList.toggle('black');
      }
    }
  }
}

function updateMovesLeft() {
  document.getElementById('moves-left').textContent = `残りの手数: ${movesLeft}`;
}

function checkGameOver() {
  let allWhite = true;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (cells[i][j].classList.contains('black')) {
        allWhite = false;
        break;
      }
    }
  }

  if (allWhite) {
    document.getElementById('game-over').textContent = 'ゲームクリア！';
  } else {
    document.getElementById('game-over').textContent = '';
  }
}

function resetGrid() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      cells[i][j].classList.remove('black');
    }
  }

  // Apply the initial flips
  initialFlips.forEach(([i, j]) => flipCells(i, j));
  movesLeft = initialFlips.length;
  updateMovesLeft();
}

function createNewGame() {
  initialFlips = [];
  let flips = Math.floor(Math.random() * 8) + 2;  // Generate a number between 2 and 9
  
  while(flips > 0){
    let i = Math.floor(Math.random() * size);
    let j = Math.floor(Math.random() * size);
    if(!initialFlips.find(([x, y]) => x === i && y === j)){
      initialFlips.push([i, j]);
      flips--;
    }
  }
  
  resetGrid();
}

document.getElementById('reset-button').addEventListener('click', resetGrid);
document.getElementById('new-game-button').addEventListener('click', createNewGame);

createGrid();
