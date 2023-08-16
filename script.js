class Ship {
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.ship = document.getElementById(this.name);
    }
}

const playerGameBoard = document.getElementById('player-board');
const opponentGameBoard = document.getElementById('opponent-board');
const rotateButton = document.getElementById('rotate');
const playerBoardCells = [];
const opponentBoardCells = [];
const carrier = new Ship('Carrier', 5);
const battleship = new Ship('Battleship', 4);
const cruiser = new Ship('Cruiser', 3);
const submarine = new Ship('Submarine', 3);
const destroyer = new Ship('Destroyer', 2);
const rowCell = [];
let isHorizontal = true;
let gameEnd = false;

const shipsArr = [carrier, battleship, cruiser, submarine, destroyer];
const lettersArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

function createGameBoard(boardName, arrName) {
    
    for (let i = 0; i < lettersArr.length; i++) {
        arrName[lettersArr[i]] = [];
    }
    
    for (let y = 0; y < 11; y++) {
        const row = document.createElement('div');

        for (let x = 0; x <= lettersArr.length; x++) {
            const gameBoardCell = document.createElement('div');
            if (x === 0 || y === 0) {
                gameBoardCell.classList.add('game-label');
                gameBoardCell.classList.add('text-shadow');
                boardName.appendChild(gameBoardCell);
                if (x>0) {
                    gameBoardCell.textContent = lettersArr[x - 1];
                }

                if (y>0) {
                    gameBoardCell.textContent = y;
                }
            } else {
                gameBoardCell.classList.add('game-cells');
                boardName.appendChild(gameBoardCell);
                gameBoardCell.dataset.x = lettersArr[x - 1];
                gameBoardCell.dataset.y = y;
                arrName[lettersArr[x - 1]][y] = { element: gameBoardCell, occupied: false };
            }

        }
    }
}


function dragShip(board, shipName, currentShipSize) {
    /*shipName.addEventListener('dragend', (event) => {
        shipName.classList.add('green');
    });*/

    board.addEventListener('dragover', (event) => {
        event.preventDefault();

    });

    board.addEventListener('drop', (event) => {
        event.preventDefault();
    
        if (event.target.classList.contains('game-cells')) {
            let x = event.target.dataset.x;
            let y = event.target.dataset.y;
            let startCell = playerBoardCells[x][y];
    
            if (isHorizontal && (lettersArr.indexOf(x) + currentShipSize) <= lettersArr.length) {
                checkAdjacentCells(x, y, isHorizontal, currentShipSize, lettersArr, playerBoardCells, (error, shipCells) => {
                    if (error) {
                        console.log(error); 
                    } else {
                        shipCells.forEach(element => {
                            element.element.style.backgroundColor = 'red';
                            element.occupied = true;
                            shipName.style.display = 'none';
                        });
                        
                    }
                });
            } else if (!isHorizontal && (parseInt(y) + currentShipSize) <= 11) {
                for (let i = 0; i < currentShipSize; i++) {
                    if (startCell.occupied) {
                        return console.log('Pole zajete');
                    }
                    startCell.element.style.backgroundColor = 'red';
                    startCell.occupied = true;
                    startCell = playerBoardCells[lettersArr[lettersArr.indexOf(x)]][parseInt(y) + i + 1];
                    shipName.style.display = 'none';
                }
            } else {
                console.log('Statek wychodzi poza granice planszy');
            }
    
            currentShipSize = 0;
        }
    });
};    

function checkAdjacentCells (x, y, isHorizontal, shipSize, letterArray, boardCells, callback) {
    let cell = boardCells[x][y];
    let adjacentCells = [];
    if (isHorizontal) {
        for (let offsetX = -1; offsetX < shipSize; offsetX++) {
            for (let offsetY = -1; offsetY <= 1; offsetY++) {
              if (cell.occupied) {
                return console.log('Pole zajęte')
              };

              if (offsetX >= 0 && offsetY === 1){
                adjacentCells.push(cell);
              }
        
              const neighborX = letterArray[letterArray.indexOf(x) + offsetX];
              const neighborY = parseInt(y) + offsetY;
        
              cell = boardCells[neighborX][neighborY];
            }
            
          }
    } else {
        
    }
    callback(null, adjacentCells);
}

function flipDirection(button) {
    button.addEventListener('click', () => {
        if (isHorizontal) {
            isHorizontal = false;
            console.log('zmiana na false');
        } else {
            isHorizontal = true; 
            console.log('zmiana na true');
        }
    })
}

/*function placeShipsRandomly(arrName) {
    shipsArr.forEach(ship => {
        let validPlacement = false;

        while (!validPlacement) {
            const x = Math.floor(Math.random() * (lettersArr.length - ship.size + 1));
            const y = Math.floor(Math.random() * (11 - ship.size + 1));

            validPlacement = true;

            for (let i = 0; i < ship.size; i++) {
                if (arrName[lettersArr[x + i]][y].occupied) {
                    validPlacement = false;
                    break;
                }
            }

            if (validPlacement) {
                for (let i = 0; i < ship.size; i++) {
                    arrName[lettersArr[x + i]][y].element.style.backgroundColor = 'red';
                    arrName[lettersArr[x + i]][y].occupied = true;
                }
            }
        }
    });
}*/


createGameBoard(playerGameBoard, playerBoardCells);
createGameBoard(opponentGameBoard, opponentBoardCells);
///placeShipsRandomly(opponentBoardCells);

do {
    flipDirection(rotateButton);

    shipsArr.forEach(shipName => {
        shipName.ship.addEventListener('dragstart', (event) => {
    
            dragShip(playerGameBoard, shipName.ship, shipName.size);
        });
        
    });

} while (gameEnd);

/*
dragstart: Rozpoczęcie przeciągania, ustawienie danych przeciągania i dostosowanie wyglądu.
dragover: Obsługa poruszania elementem przeciąganym nad obszarem docelowym. 
drop: Reakcja na upuszczenie elementu przeciąganego na obszarze docelowym.
dragend: Zakończenie przeciągania, przywrócenie pierwotnego wyglądu.
*/


   /* board.addEventListener('drop', (event) => {
        event.preventDefault();
    
        if (event.target.classList.contains('game-cells')) {
            let x = event.target.dataset.x;
            let y = event.target.dataset.y;
            let startCell = playerBoardCells[x][y];
    
            if (isHorizontal && (lettersArr.indexOf(x) + currentShipSize) <= lettersArr.length) {
                for (let i = 0; i < currentShipSize; i++) {
                    if (startCell.occupied) {
                        return console.log('Pole zajete');
                    } 
                    startCell.element.style.backgroundColor = 'red';
                    startCell.occupied = true;
                    startCell = playerBoardCells[lettersArr[lettersArr.indexOf(x) + i + 1]][y];
                    shipName.style.display = 'none';
                }
            } else if (!isHorizontal && (parseInt(y) + currentShipSize) <= 11) {
                for (let i = 0; i < currentShipSize; i++) {
                    if (startCell.occupied) {
                        return console.log('Pole zajete');
                    }
                    startCell.element.style.backgroundColor = 'red';
                    startCell.occupied = true;
                    startCell = playerBoardCells[lettersArr[lettersArr.indexOf(x)]][parseInt(y) + i + 1];
                    shipName.style.display = 'none';
                }
            } else {
                console.log('Statek wychodzi poza granice planszy');
            }
    
            currentShipSize = 0;
        }
    });*/