const GameBoard = (function () {
    console.log("Construimos el tablero");
    const gameBoard = []
    const numFilas = 3
    const numCols = 3
    
    const addMark = function (fila, columna, player) {
        if(gameBoard[fila][columna]!==" "){
            console.log("Casilla ocupada");
        }else{
            gameBoard[fila][columna] = player.getToken()
        }
        displayGameBoard()
    }

    const initGameBoard = function () {
        for (let i = 0; i < numFilas; i++) {
            gameBoard[i] = []
            for (let j = 0; j < numCols; j++) {
                gameBoard[i][j] = " "
            }
        }
    }

    const getGameBoard = () => gameBoard
    const getNumRows = () => numFilas
    const getNumCols = () => numCols

    const displayGameBoard = function () {
        for (let i = 0; i < numFilas; i++) {
            let fila = "|"
            for (let j = 0; j < numCols; j++) {
                fila += gameBoard[i][j] + "|"
            }
            console.log(fila);
        }
        console.log();
    }

    const clearGameBoard = function() {
        console.log("Nueva partida\n");
        initGameBoard()
        displayGameBoard()
    }

    return {displayGameBoard, getGameBoard, addMark, clearGameBoard, initGameBoard, getNumRows, getNumCols}
})();


const createPlayer =  function (name, token) {
    let wins = 0

    const getToken = () => token
    const getName = () => name
    const getWins = () => wins
    const addWins = () => wins++
    const resetWins = () => wins = 0

    return {getToken, getName, getWins, addWins, resetWins}
}

const player1 = createPlayer("Player 1", "X")
const player2 = createPlayer("Player 2", "O")
var activePlayer = player1

const Game = (function() {
    const score = [0, 0]
    let ended = false

    GameBoard.initGameBoard()
    GameBoard.displayGameBoard();
    
    function playRound(row, col) {
        if(!ended){
            GameBoard.addMark(row, col, activePlayer)
            if(checkWin()){
                console.log("🚀 ~ file: script.js:67 ~ Game ~ checkWin():", checkWin())
                ended = true
                activePlayer.addWins()
                DisplayController.updateScore()
                DisplayController.finishRound()
            }
            switchPlayerActive()
        }
    }

    function checkWin(){
        console.log("Check Win");
        const gameBoard = GameBoard.getGameBoard()
        let win = false
        checkRows()
        checkColum()
        checkDiagonal()

        function checkRows(){
            for (let i = 0; i < GameBoard.getNumRows(); i++) {
                if(gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][0] === gameBoard[i][2] && gameBoard[i][0] !== " ") win = true
            }
        }

        function checkColum(){
            for (let i = 0; i < GameBoard.getNumCols(); i++) {
                if(gameBoard[0][i] === gameBoard[1][i] && gameBoard[0][i] === gameBoard[2][i] && gameBoard[0][i] !== " ") win = true
            }
        }

        function checkDiagonal(){
            if((gameBoard[0][0] === gameBoard[1][1] && gameBoard[0][0] === gameBoard[2][2] && gameBoard[0][0] !== " ")
            || (gameBoard[0][2] === gameBoard[1][1] && gameBoard[0][2] === gameBoard[2][0] && gameBoard[0][2] !== " ")) win = true
        }

        return win
    }

    function switchPlayerActive(){
        activePlayer === player1 ? activePlayer = player2 : activePlayer = player1
        console.log("Changin the player");
    }

    const getEnded = () => ended
    const setEnded = (state) => {
        ended = state 
    }

    return {switchPlayerActive, playRound, getEnded, setEnded}
})();


const DisplayController = (function () {
    const cells = document.querySelectorAll(".cell")
    const player1score = document.querySelector(".player-one-data .player-score")
    const player2score = document.querySelector(".player-two-data .player-score")
    const reset = document.querySelector(".button-section .reset")
    const dialog = document.querySelector('dialog')
    const dialogWiner = document.querySelector('.dialog-player-win')
    const btnQuit = document.querySelector('.quit-buton')
    const btnNextRound = document.querySelector('.next-round')
    console.log("🚀 ~ file: script.js:138 ~ DisplayController ~ btnNextRound:", btnNextRound)
    
    btnNextRound.addEventListener('click', () => {
        GameBoard.clearGameBoard()
        clearDisplayBoard()
        dialog.close()
    })

    btnQuit.addEventListener('click', () => {
        console.log("Quit");
        GameBoard.clearGameBoard()
        clearDisplayBoard()
        resetPlayers()
        dialog.close()
    })

    function clearDisplayBoard() {
        cells.forEach(cell => {
            cell.textContent = ''
            cell.classList.remove('checked')
            Game.setEnded(false)
            activePlayer = player1
        })
    }

    function resetPlayers() {
        player1.resetWins()
        player2.resetWins()
        player1score.textContent = 'Score: 0'
        player2score.textContent = 'Score: 0'
    }

    reset.addEventListener('click', () => {
        console.log("Reset");
        GameBoard.clearGameBoard()
        clearDisplayBoard()
        resetPlayers()
        console.log(Game.getEnded());
    })

    cells.forEach(cell => {
        const row = cell.dataset.row
        const col = cell.dataset.col
        cell.addEventListener('click', () =>{
            console.log(cell.dataset.row);
            console.log(cell.dataset.col);
            if(!cell.classList.contains( 'checked') && !Game.getEnded()){
                cell.textContent = activePlayer.getToken()
                Game.playRound(row, col)
                cell.classList.add('checked')
            }
        })
    })

    const updateScore = function () {
        console.log("update score");
        player1score.textContent = `Score: ${player1.getWins()}`
        player2score.textContent = `Score: ${player2.getWins()}`
    }

    const finishRound = function () {
        dialogWiner.textContent = `${activePlayer.getName()} Wins`
        dialog.showModal()
    }

    return {updateScore, finishRound}
})()