import { Ship, Cell, GameBoard } from './battleshipClasses.js';

const bodyElement = document.body;
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
let gameActive = true;

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
    //debugger;
    const popup = document.createElement('div');;
    popup.textContent = message;
    popup.classList.add('popup');
    bodyElement.insertAdjacentElement('beforeend', popup);
    
    if (duration != 0) {
        setTimeout(() => {
            popup.remove()}, duration);
    } else {
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.classList.add('close-button');
        popup.appendChild(closeButton);
        closeButton.addEventListener('click', () => {
            popup.remove();
    });
        
    }
}

function endGame(winner){
    showPopup((winner + ' is win'), 0);
    gameActive = false;
}

function checkAdjacentCell(params) {
    const { col, row, size, orientation, gameArr } = params;
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
            markCellAsHit(cellElement, true);
            hitCounterEnemy++;

            if (hitCounterEnemy === 17) {
                endGame('Computer');
            }
            enemyFire();
        } else {
            markCellAsHit(cellElement, false);
        }
    }

}

function markCellAsHit(cell, isShipHit) {
    cell.classList.add('hit');
    const dot = document.createElement('div');

    if(isShipHit) {
        dot.classList.add('dot-ship');
        cell.appendChild(dot);
    } else {
        dot.classList.add('dot');
        cell.appendChild(dot);
        cell.classList.remove('game-cells');
    }
}

function placeEnemyShips() {
    enemyShipsArr.forEach(ship => {
        let isPlaced = false;
        while (!isPlaced) {
            const isHorizontal = Math.random() < 0.5;
            const rowIdx = 1 + Math.floor(Math.random() * 10);
            const colIdx = 1 + Math.floor(Math.random() * 10);
            const paramsPlaceEnemyShip = {
                col: colIdx,
                row: rowIdx,
                size: ship.size,
                orientation: isHorizontal,
                gameArr: enemyGameArr
            }

            if (isHorizontal) {
                if (colIdx + ship.size <= 10 && checkAdjacentCell(paramsPlaceEnemyShip)) {
                    for (let i = 0; i < ship.size; i++) {
                        const nextCol = colIdx + i;
                        const cell = enemyGameArr.getCell(rowIdx, nextCol);
                        cell.setOccupied(true);
                        cell.setShipName(ship.name);
                    }
                    isPlaced = true;
                }
            } else {
                if (rowIdx + ship.size <= 10 && checkAdjacentCell(paramsPlaceEnemyShip)) {
                    for (let i = 0; i < ship.size; i++) {
                        const nextRow = rowIdx + i;
                        const cell = enemyGameArr.getCell(nextRow, colIdx);
                        cell.setOccupied(true);
                        cell.setShipName(ship.name);
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
        startBtn.classList.add('animate__animated', 'animate__bounce');
        return true;
    } else {
        return false;
    }
}

function playerFire(cells, gameArr) {
    cells.forEach(cellElement => {

        cellElement.addEventListener('click', () => {
            if (!gameActive) return;

            const rowIdx = parseInt(cellElement.getAttribute('data-row'));
            const colIdx = parseInt(cellElement.getAttribute('data-col'));
            const cell = gameArr.getCell(rowIdx, colIdx);

            if (!cell.isHit()) {
                cell.setHit(true);

                if (cell.isOccupied()) {
                    markCellAsHit(cellElement, true);
                    hitCounterPlayer++;


                    if (hitCounterPlayer === 17) {
                        endGame('Player');
                    } else {
                        let hitShipName = cell.getPlacedShipName();
                        showPopup('Hit ' + hitShipName, 500);
                        
                        enemyShipsArr.forEach(ship => {
                            if (ship.name === hitShipName){
                                ship.hitShip();
                                ship.addCells(cell);
                                if(ship.isShipSunk()) {
                                    showPopup(hitShipName + ' was sunk', 500);
                                    ship.shipCells.forEach(sunkCell => {
                                        sunkCell.getElement(enemyBoardGame);
                                        sunkCell.element.style.backgroundColor = 'rgb(207, 46, 46, 0.5)';                                    })
                                }
                            }
                        });
                    }

                } else {
                    markCellAsHit(cellElement, false);
                    enemyFire();
                }
            } else {
                showPopup('You\'ve already shot here.', 500);
            }
        });
    });
}

function hoverCell(params){
    const { row, col, size, orientation, gameArr, color } = params;
    
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

function handleHoverEvent(event, color) {
    event.preventDefault();
    const rowIdx = parseInt(event.target.getAttribute('data-row'));
    const colIdx = parseInt(event.target.getAttribute('data-col'));
    const hoverCellParams = {
        col: colIdx,
        row: rowIdx,
        size: draggedShip.size,
        orientation: isHorizontal,
        gameArr: playerGameArr,
        color: color
    };
    hoverCell(hoverCellParams);
}

function setCellOccupied(cell, cellElement, ship){
    cell.setOccupied(true);
    cellElement.style.backgroundColor = '#8A9FB1ff';
    ship.ship.style.display = 'none';
    ship.placed = true;
    checkStart(shipsArr); 
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
    const params = {
        col: colIdx,
        row: rowIdx,
        size: draggedShip.size,
        orientation: isHorizontal,
        gameArr: playerGameArr,
        color: 'rgba(0, 0, 0, 0.4)'
    };

    if (isHorizontal) {
        if ((colIdx + draggedShip.size) <= 11 && checkAdjacentCell(params)) {
            for (let i = 0; i < draggedShip.size; i++) {
                const nextCol = colIdx + i;
                const cell = playerGameArr.getCell(rowIdx, nextCol);
                const cellElement = document.querySelector(`[data-row="${rowIdx}"][data-col="${nextCol}"]`);
                setCellOccupied(cell, cellElement, draggedShip);
            }
        } else {
            showPopup("The ship does not fit on the board or the adjacent spaces are occupied!", 2000);
            hoverCell(params);
        }
    } else {
        if ((rowIdx + draggedShip.size) <= 11 && checkAdjacentCell(params)) {
            for (let i = 0; i < draggedShip.size; i++) {
                const nextRow = rowIdx + i;
                const cell = playerGameArr.getCell(nextRow, colIdx);
                const cellElement = document.querySelector(`[data-row="${nextRow}"][data-col="${colIdx}"]`);
                setCellOccupied(cell, cellElement, draggedShip);
            }
        } else {
            showPopup("The ship does not fit on the board or the adjacent spaces are occupied!", 2000);
            hoverCell(params);
        }
    }
});

playerBoardGame.addEventListener('dragover', (event) => {
    handleHoverEvent(event, 'rgba(255, 0, 0, 0.5)');
});

playerBoardGame.addEventListener('dragleave', (event) => {
    handleHoverEvent(event, 'rgba(0, 0, 0, 0.4)');
});

startBtn.addEventListener('click', () => {
    if(checkStart(shipsArr)){
        placeEnemyShips();
        startBtn.remove();
        const enemyCells = document.querySelectorAll('#enemy-board .game-cells');
        playerFire(enemyCells, enemyGameArr);
    } else {
        showPopup('Place all ships on the board!', 3000);
    }
});

restartBtn.addEventListener('click', () => {
    restartGame();
});




