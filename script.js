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
                arrName[lettersArr[x - 1]][y] = gameBoardCell;
            }

        }
    }
}


function dragShip(board, shipName, currentShipSize){
    
    shipName.addEventListener('dragend', (event) => {
        shipName.classList.add('green');
    });

    board.addEventListener('dragover', (event) => {
        event.preventDefault();
        shipName.style.backgroundColor = 'blue'; 


    });

    board.addEventListener('drop', (event) => {
        event.preventDefault();
    
        if (event.target.classList.contains('game-cells')) {
            
            let startCell = playerBoardCells[event.target.dataset.x][event.target.dataset.y];
            
            for (let i = 0; i < currentShipSize; i++) {
                if (startCell.dataset.ship === 'on'){
                    return console.log('Pole zajete');
                }
                if (isHorizontal) {
                    startCell.style.backgroundColor = 'red';
                    startCell.dataset.ship = 'on';
                    startCell = playerBoardCells[lettersArr[lettersArr.indexOf(event.target.dataset.x) + i + 1]][event.target.dataset.y];
                } else {
                    startCell.style.backgroundColor = 'red';
                    startCell.dataset.ship = 'on';
                    startCell = playerBoardCells[lettersArr[lettersArr.indexOf(event.target.dataset.x)]][parseInt(event.target.dataset.y) + i + 1];
                }
            }
            currentShipSize = 0;
        }
    });
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


createGameBoard(playerGameBoard, playerBoardCells);
createGameBoard(opponentGameBoard, opponentBoardCells);

do {
    flipDirection(rotateButton);
    shipsArr.forEach(shipName => {
        shipName.ship.addEventListener('dragstart', (event) => {
    
            dragShip(playerGameBoard, shipName.ship, shipName.size);
        });
        
    });

} while (gameEnd);

