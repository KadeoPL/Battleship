class Ship {
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.ship = document.getElementById(this.name);
        this.placed = true;
    }
}

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.occupied = false;
        this.hit = false;
        this.element = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    isOccupied() {
        return this.occupied;
    }

    setOccupied(value) {
        this.occupied = value;
    }

    isHit(){
        return this.hit;
    }

    setHit(value){
        this.hit = value;
    }
}

class GameBoard {
    constructor(rows, cols, boardGameName) {
        this.rows = rows;
        this.cols = cols;
        this.board = new Array(rows).fill(null).map(() => new Array(cols).fill(null));
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                
                if (row === 0 || col === 0) {
                    const gameBoardCell = document.createElement('div');
                    gameBoardCell.classList.add('game-labels');
                    boardGameName.appendChild(gameBoardCell);
                    
                    if (row > 0) {
                        gameBoardCell.textContent = row;
                    } 

                    if (col > 0) {
                        gameBoardCell.textContent = String.fromCharCode(64 + col);
                    }
                } else {
                    
                    this.board[row][col] = new Cell(row, col);
                    const gameBoardCell = document.createElement('div');
                    gameBoardCell.classList.add('game-cells');
                    gameBoardCell.setAttribute('data-row', row);
                    gameBoardCell.setAttribute('data-col', col);
                    boardGameName.appendChild(gameBoardCell);
                }
            }
        }
    }

    getCell(row, col) {
        return this.board[row][col];
    }
}

const rotateBtn = document.getElementById('rotate-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const playerBoardGame = document.getElementById('player-board');
const enemyBoardGame = document.getElementById('enemy-board');
const rows = 11;
const cols = 11;
let isHorizontal = true;
let draggedShip;
let hitCounterEnemy = 0;
let hitCounterPlayer = 0;

const carrier = new Ship('Carrier', 5);
const battleship = new Ship('Battleship', 4);
const cruiser = new Ship('Cruiser', 3);
const submarine = new Ship('Submarine', 3);
const destroyer = new Ship('Destroyer', 2);
const shipsArr = [carrier, battleship, cruiser, submarine, destroyer];

const enemyCarrier = new Ship('Carrier', 5);
const enemyBattleship = new Ship('Battleship', 4);
const enemyCruiser = new Ship('Cruiser', 3);
const enemySubmarine = new Ship('Submarine', 3);
const enemyDestroyer = new Ship('Destroyer', 2);
const enemyShipsArr = [enemyCarrier, enemyBattleship, enemyCruiser, enemySubmarine, enemyDestroyer];

const playerGameArr = new GameBoard(rows, cols, playerBoardGame);
const enemyGameArr = new GameBoard(rows, cols, enemyBoardGame);

function flipDirection(button) {
    button.addEventListener('click', () => {
        if (isHorizontal) {
            isHorizontal = false;
            button.style.setProperty('--before-rotate', '90deg');
        } else {
            isHorizontal = true; 
            button.style.setProperty('--before-rotate', '0deg');
        }
    })
}

function showPopup(message, duration) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.classList.add('show-popup');

    if (duration != 0) {
        setTimeout(() => {
            popup.classList.remove('show-popup');}, duration);
    } else {
        const closeButton = document.createElement('button');
        closeButton.textContent = "Close";
        popup.appendChild(closeButton);
        closeButton.addEventListener('click', () => {
        popup.classList.remove('show-popup');
    });
        
    }
}

function endGame(winner){
    showPopup((winner + 'is win'), 0);
}

function checkAdjacentCell(col, row, size, orientation, gameArr) {

    if (orientation) {
    for (let i = -1; i <= 1 ; i++) {
        for (let j = -1; j < size+1; j++) {
            const nextCol = col + j;
            const nextRow = row + i;
            if (nextCol >= 1 && nextCol <= 10 && nextRow >= 1 && nextRow <= 10) {
                const nextCell = gameArr.getCell(nextRow, nextCol);
                if (nextCell.isOccupied()) {
                    return false;
                }
            }
        }
    }
    return true;
} else {
    for (let i = -1; i < size+1 ; i++) {
        for (let j = -1; j <= 1 ; j++) {
            const nextCol = col + j;
            const nextRow = row + i;
            if (nextCol >= 1 && nextCol <= 10 && nextRow >= 1 && nextRow <= 10) {
                const nextCell = gameArr.getCell(nextRow, nextCol);
                if (nextCell.isOccupied()) {
                    return false;
                }
            }
        }
    }
    return true;
}
}

function enemyFire() {
    let colIdx = 1 + Math.floor((11 - 1) * Math.random());
    let rowIdx = 1 + Math.floor((11 - 1) * Math.random());

    const cell = playerGameArr.getCell(rowIdx, colIdx);
    const cellElement = playerBoardGame.querySelector(`[data-row="${rowIdx}"][data-col="${colIdx}"]`);

    

    if (cell.hit) {
        enemyFire();
    } else {
        cell.setHit(true);
        if(cell.isOccupied()){
            cellElement.classList.add('hit');
            const dot = document.createElement('div');
            dot.classList.add('dot-ship');
            cellElement.appendChild(dot);
            
            hitCounterEnemy++;

            
            if (hitCounterEnemy === 17) {
                endGame('Computer');
            }
            enemyFire();
        } else {
            cellElement.classList.add('hit');
            const dot = document.createElement('div');
            dot.classList.add('dot');
            cellElement.appendChild(dot);
            cellElement.classList.remove('game-cells');
        }
    }

}

function placeEnemyShips() {
    enemyShipsArr.forEach(ship => {
        let isPlaced = false;
        while (!isPlaced) {
            const isHorizontal = Math.random() < 0.5;
            const rowIdx = 1 + Math.floor(Math.random() * 10);
            const colIdx = 1 + Math.floor(Math.random() * 10);

            if (isHorizontal) {
                if (colIdx + ship.size <= 10 && checkAdjacentCell(colIdx, rowIdx, ship.size, isHorizontal, enemyGameArr)) {
                    for (let i = 0; i < ship.size; i++) {
                        const nextCol = colIdx + i;
                        const cell = enemyGameArr.getCell(rowIdx, nextCol);
                        const cellElement = enemyBoardGame.querySelector(`[data-row="${rowIdx}"][data-col="${nextCol}"]`);
                        cellElement.style.backgroundColor = '#FFFFFF';
                        cell.setOccupied(true);
                    }
                    isPlaced = true;
                }
            } else {
                if (rowIdx + ship.size <= 10 && checkAdjacentCell(colIdx, rowIdx, ship.size, isHorizontal, enemyGameArr)) {
                    for (let i = 0; i < ship.size; i++) {
                        const nextRow = rowIdx + i;
                        const cell = enemyGameArr.getCell(nextRow, colIdx);
                        const cellElement = enemyBoardGame.querySelector(`[data-row="${nextRow}"][data-col="${colIdx}"]`);
                        cellElement.style.backgroundColor = '#FFFFFF';
                        cell.setOccupied(true);
                    }
                    isPlaced = true;
                }
            }
        }
    });
}

function checkStart(shipsArr) {
    const allShipsPlaced = shipsArr.every(ship => ship.placed);

    if (allShipsPlaced) {
        startBtn.style.background = 'red';
        return true;
    } else {
        return false;
    }
}

function playerFire(cells, gameArr){
    cells.forEach(cellElement => {
 
    cellElement.addEventListener('click', () => {
    const rowIdx = parseInt(cellElement.getAttribute('data-row'));
    const colIdx = parseInt(cellElement.getAttribute('data-col'));
    const cell = gameArr.getCell(rowIdx, colIdx);

    if(!cell.hit){
        cell.setHit(true);
        
        if(cell.isOccupied()){
            showPopup('Hit a opponent ship!', 1000);
            cellElement.classList.add('hit');
            const dot = document.createElement('div');
            dot.classList.add('dot-ship');
            cellElement.appendChild(dot);
            
            hitCounterPlayer++;
            if (hitCounterPlayer === 17) {
                endGame('Player', 2000);
             }

        } else {
            cellElement.classList.add('hit');
            const dot = document.createElement('div');
            dot.classList.add('dot');
            cellElement.appendChild(dot);
            cellElement.classList.remove('game-cells');
            enemyFire();
        }
        
    } else {
        console.log('Tutaj już strzelano!');
    }
    
});
});
}

function hoverCell(row, col, size, orientation, gameArr, color){
    if(orientation) {
        for (let i = 0; i < size; i++) {
            const nextCol = col + i;
            if (nextCol > 0 && nextCol <= 10){
            const cellElement = document.querySelector(`[data-row="${row}"][data-col="${nextCol}"]`);
            if (!gameArr.getCell(row, nextCol).isOccupied()) {
                cellElement.style.backgroundColor = color;
            }
        }
        }
    } else {
        for (let i = 0; i < size; i++) {
            const nextRow = row + i;
            if (nextRow > 0 && nextRow <= 10) {
                const cellElement = document.querySelector(`[data-row="${nextRow}"][data-col="${col}"]`);
                if (!gameArr.getCell(nextRow, col).isOccupied()) {
                    cellElement.style.backgroundColor = color;
                }
            }
        }
    }
}

function restartGame(){
    window.location.reload();
}

flipDirection(rotateBtn);

shipsArr.forEach(shipName => {
    shipName.ship.addEventListener('dragstart', () => {
        draggedShip = shipName;
    });
});

playerBoardGame.addEventListener('dragover', (event) => {
    event.preventDefault();
});

playerBoardGame.addEventListener('drop', (event) => {
    event.preventDefault();

    const rowIdx = parseInt(event.target.getAttribute('data-row'));
    const colIdx = parseInt(event.target.getAttribute('data-col'));
    if (isHorizontal) {
        if ((colIdx + draggedShip.size) <= 11 && checkAdjacentCell(colIdx, rowIdx, draggedShip.size, isHorizontal, playerGameArr)) {
            for (let i = 0; i < draggedShip.size; i++) {
                const nextCol = colIdx + i;
                const cell = playerGameArr.getCell(rowIdx, nextCol);
                const cellElement = document.querySelector(`[data-row="${rowIdx}"][data-col="${nextCol}"]`);
                
                cell.setOccupied(true);
                cellElement.style.backgroundColor = '#8A9FB1ff';
                draggedShip.ship.style.display = 'none';
                draggedShip.placed = true;
                checkStart(shipsArr);
            }
        } else {
            showPopup("The ship does not fit on the board or the adjacent spaces are occupied!", 2000);
            hoverCell(rowIdx, colIdx, draggedShip.size, isHorizontal, playerGameArr, ' rgba(0, 0, 0, 0.4)');
        }
    } else {
        if ((rowIdx + draggedShip.size) <= 11 && checkAdjacentCell(colIdx, rowIdx, draggedShip.size, isHorizontal, playerGameArr)) {
            for (let i = 0; i < draggedShip.size; i++) {
                const nextRow = rowIdx + i;
                const cell = playerGameArr.getCell(nextRow, colIdx);
                const cellElement = document.querySelector(`[data-row="${nextRow}"][data-col="${colIdx}"]`);
                
                cell.setOccupied(true);
                cellElement.style.backgroundColor = '#8A9FB1ff';
                draggedShip.ship.style.display = 'none';
                draggedShip.placed = true;
                checkStart(shipsArr);
            }
        } else {
            showPopup("The ship does not fit on the board or the adjacent spaces are occupied!", 2000);
            hoverCell(rowIdx, colIdx, draggedShip.size, isHorizontal, playerGameArr, ' rgba(0, 0, 0, 0.4)');
        }
    }
});

playerBoardGame.addEventListener('dragover', (event) => {
    event.preventDefault();
    const rowIdx = parseInt(event.target.getAttribute('data-row'));
    const colIdx = parseInt(event.target.getAttribute('data-col'));
    hoverCell(rowIdx, colIdx, draggedShip.size, isHorizontal, playerGameArr, 'rgba(255, 0, 0, 0.5)');
        
});

playerBoardGame.addEventListener('dragleave', (event) => {
    event.preventDefault();
    const rowIdx = parseInt(event.target.getAttribute('data-row'));
    const colIdx = parseInt(event.target.getAttribute('data-col'));
    hoverCell(rowIdx, colIdx, draggedShip.size, isHorizontal, playerGameArr, ' rgba(0, 0, 0, 0.4)');
});

startBtn.addEventListener('click', () => {
    if(checkStart(shipsArr)){
        placeEnemyShips();
        startBtn.remove();
        showPopup('Choose a cell on your opponents boards!', 3000);
        const enemyCells = document.querySelectorAll('#enemy-board .game-cells');
        playerFire(enemyCells, enemyGameArr);
    } else {
        showPopup('Place all ships on the board!', 3000);
    }
});

restartBtn.addEventListener('click', () => {
    restartGame();
});




