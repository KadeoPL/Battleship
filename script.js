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

function dragShip(board, shipName) {

    board.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    board.addEventListener('drop', (event) => {
        event.preventDefault();
    
})
}

const playerGameBoard = new GameBoard(rows, cols, playerBoardGame);
const enemyGameBoard = new GameBoard(rows, cols, enemyBoardGame);


flipDirection(rotateBtn);

shipsArr.forEach(ship => {
    ship.ship.addEventListener('dragstart', (event) => { 
        dragShip(playerGameBoard.board, ship.name);
    });
});