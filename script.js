class Ship {
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.ship = document.getElementById(this.name);
        this.counterHit = 0;
        this.isSunk = false;
    }
}

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.occupied = false;
        this.hit = false;
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

const carrier = new Ship('Carrier', 5);
const battleship = new Ship('Battleship', 4);
const cruiser = new Ship('Cruiser', 3);
const submarine = new Ship('Submarine', 3);
const destroyer = new Ship('Destroyer', 2);
const shipsArr = [carrier, battleship, cruiser, submarine, destroyer];

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

function dragShip(board, array, ship) {
    
    board.addEventListener('drag', (event) => {
        ship.style.backgroundColor = 'green';
        event.preventDefault();
    });

    board.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    board.addEventListener('drop', (event) => {
        event.preventDefault();
        console.log('Wywołana funkcja');
        const rowIdx = parseInt(event.target.getAttribute('data-row'));
        const colIdx = parseInt(event.target.getAttribute('data-col'));
        let cell = array.getCell(rowIdx, colIdx);

        if (cell.isOccupied()) {
            console.log('Pole zajęte');
        } else {
            if (isHorizontal) {
                for (let i = 0; i < ship.size; i++) {
                    const nextCol = colIdx + i;
                    cell = array.getCell(rowIdx, nextCol);
                    console.log(ship.size);

                    
                    const cellElement = document.querySelector(`[data-row="${rowIdx}"][data-col="${nextCol}"]`);
                    cellElement.style.backgroundColor = 'red';

                    cell.setOccupied(true);
                    cell.ship = ship;
                }
            }
        }

        console.log(rowIdx, colIdx);
        console.log(cell);


    board.addEventListener('dragend', (event) => {
         event.preventDefault();
    });    
    
})};

flipDirection(rotateBtn);


shipsArr.forEach(shipName => {
    shipName.ship.addEventListener('dragstart', (event) => {
        dragShip(playerBoardGame, playerGameArr, shipName);
        console.log('Umieszczam statek');
    });
});



