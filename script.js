class Ship {
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.ship = document.getElementById(this.name);
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

function checkAdjacentCell(col, row, size, orientation, gameArr) {

    if (orientation) {
    for (let i = -1; i < size ; i++) {
        for (let j = -1; j < size+1; j++) {
            const nextCol = col + j;
            const nextRow = row + i;

            if (nextCol >= 1 && nextCol <= 10 && nextRow >= 1 && nextRow <= 10) {
                const nextCell = gameArr.getCell(nextRow, nextCol);
                if (nextCell.isOccupied()) {
                    console.log('Pole ' + nextRow + ' ' + nextCol + 'jest zajete');
                    return false;
                }
            }
        }
    }
    return true;
} else {
    for (let i = -1; i < size+1 ; i++) {
        for (let j = -1; j < size; j++) {
            const nextCol = col + j;
            const nextRow = row + i;
            console.log('Sprawdzam pole ' + nextRow + ' ' + nextCol);

            if (nextCol >= 1 && nextCol <= 10 && nextRow >= 1 && nextRow <= 10) {
                const nextCell = gameArr.getCell(nextRow, nextCol);
                if (nextCell.isOccupied()) {
                    console.log('Pole ' + nextRow + ' ' + nextCol + 'jest zajete');
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
    console.log(colIdx, rowIdx);

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
                console.log('Komputer wygrał');
                return;
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
            console.log('Umieszczam: ' + ship.name);

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

flipDirection(rotateBtn);


shipsArr.forEach(shipName => {
    shipName.ship.addEventListener('dragstart', (event) => {
        console.log('Umieszczam statek');
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
        if ((colIdx + draggedShip.size) <= 10 && checkAdjacentCell(colIdx, rowIdx, draggedShip.size, isHorizontal, playerGameArr)) {
            for (let i = 0; i < draggedShip.size; i++) {
                const nextCol = colIdx + i;
                const cell = playerGameArr.getCell(rowIdx, nextCol);
                const cellElement = document.querySelector(`[data-row="${rowIdx}"][data-col="${nextCol}"]`);
                
                cell.setOccupied(true);
                cellElement.style.backgroundColor = '#8A9FB1ff';
                draggedShip.ship.style.display = 'none';
            }
        } else {
            console.log('Statek nie mieści się na planszy lub sąsiednie pola są zajęte');
        }
    } else {
        if ((rowIdx + draggedShip.size) <= 10 && checkAdjacentCell(colIdx, rowIdx, draggedShip.size, isHorizontal, playerGameArr)) {
            for (let i = 0; i < draggedShip.size; i++) {
                const nextRow = rowIdx + i;
                const cell = playerGameArr.getCell(nextRow, colIdx);
                const cellElement = document.querySelector(`[data-row="${nextRow}"][data-col="${colIdx}"]`);
                
                cell.setOccupied(true);
                cellElement.style.backgroundColor = '#8A9FB1ff';
                draggedShip.ship.style.display = 'none';
            }
        } else {
            console.log('Statek nie mieści się na planszy lub sąsiednie pola są zajęte');
        }
    }
});

const enemyCells = document.querySelectorAll('#enemy-board .game-cells');
placeEnemyShips();

enemyCells.forEach(cellElement => {
    cellElement.addEventListener('click', () => {
        const rowIdx = parseInt(cellElement.getAttribute('data-row'));
        const colIdx = parseInt(cellElement.getAttribute('data-col'));
        const cell = enemyGameArr.getCell(rowIdx, colIdx);

        if(!cell.hit){
            cell.setHit(true);
            
            if(cell.isOccupied()){
                console.log('Trafiony statek przeciwnika');
                cellElement.classList.add('hit');
                const dot = document.createElement('div');
                dot.classList.add('dot-ship');
                cellElement.appendChild(dot);
                
                hitCounterPlayer++;
                if (hitCounterPlayer === 17) {
                    console.log('Gracz wygrał');
                    return;
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

