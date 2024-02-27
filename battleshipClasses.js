class Ship {
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.ship = document.getElementById(this.name);
        this.placed = false;
        this.hitCounter = 0;
        this.shipCells = [];
    }

    isShipSunk() {
        return this.size === this.hitCounter;
    }

    hitShip(){
        this.hitCounter++;
    }

    addCells(cell){
        this.shipCells.push(cell);
    }
}

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.occupied = false;
        this.hit = false;
        this.element;
        this.placedShipName = '';
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

    setShipName(value){
        this.placedShipName = value;
    }

    getPlacedShipName(){
        return this.placedShipName;
    }

    getElement(board){
        this.element = board.querySelector(`[data-row="${this.row}"][data-col="${this.col}"]`);
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

export { Ship, Cell, GameBoard };