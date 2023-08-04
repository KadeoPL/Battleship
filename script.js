class Ship {
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }

    getShip() {
        const ship = document.getElementById(this.name);
        return ship;
    }
}

const playerGameBoard = document.getElementById('player-board');
const opponentGameBoard = document.getElementById('opponent-board');
const playerBoardCells = [];
const opponentBoardCells = [];
const carrier = new Ship('Carrier', 5);
const battleship = new Ship('Battleship', 4);
const cruiser = new Ship('Cruiser', 3);
const submarine = new Ship('Submarine', 3);
const destroyer = new Ship('Destroyer', 2);
const lettersArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

function createGameBoard(boardName, arrName) {
    for (let y = 0; y < 11; y++) {
        const row = document.createElement('div');
        row.classList.add('game-row');

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
                gameBoardCell.dataset.x = lettersArr[x - 1]; 
                gameBoardCell.dataset.y = y; 
                boardName.appendChild(gameBoardCell);
            }
        }
        arrName.push(row);
    }
}


createGameBoard(playerGameBoard, playerBoardCells);
createGameBoard(opponentGameBoard, opponentBoardCells);
console.log(submarine.getShip);