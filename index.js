let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let gameMode = null;
let difficulty = 'easy';
let theme = 'light';

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function setGameMode(mode) {
    gameMode = mode;
    gameActive = true;
    document.getElementById('ludo-board').classList.add('hidden');
    document.getElementById('tic-tac-toe-board').classList.remove('hidden');
    resetGame();
    updateTurnIndicator();
}

function backToMenu() {
    document.getElementById('tic-tac-toe-board').classList.add('hidden');
    document.getElementById('ludo-board').classList.remove('hidden');
}

function toggleDifficulty() {
    difficulty = difficulty === 'easy' ? 'hard' : 'easy';
    document.getElementById('difficulty-text').innerText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
} 

function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    document.getElementById('theme-text').innerText = theme.charAt(0).toUpperCase() + theme.slice(1);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', theme);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        theme = savedTheme;
        document.getElementById('theme-text').innerText = theme.charAt(0).toUpperCase() + theme.slice(1);
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
}

loadSavedTheme();

function updateTurnIndicator() {
    const turnText = gameMode === 'pvp' 
        ? `Player ${currentPlayer}'s turn`
        : currentPlayer === 'X' ? "Your turn" : "Computer's turn";
    document.getElementById('player-turn').innerText = turnText;
}

function makeMove(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        if (checkWinner()) {
            const winner = gameMode === 'pvc' && currentPlayer === 'O' ? 'Computer' : `Player ${currentPlayer}`;
            document.getElementById('result').innerText = `${winner} wins!`;
            gameActive = false;
            return;
        }

        if (isBoardFull()) {
            document.getElementById('result').innerText = 'It\'s a tie!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnIndicator();

        if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
            setTimeout(computerMove, 700);
        }
    }
}

function computerMove() {
    if (difficulty === 'easy') {
        const availableMoves = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        makeMove(randomIndex);
    } else {
        const availableMoves = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        
        for (let index of availableMoves) {
            const boardCopy = [...gameBoard];
            boardCopy[index] = 'O';
            if (checkWinnerForBoard(boardCopy)) {
                makeMove(index);
                return;
            }
        }

        for (let index of availableMoves) {
            const boardCopy = [...gameBoard];
            boardCopy[index] = 'X';
            if (checkWinnerForBoard(boardCopy)) {
                makeMove(index);
                return;
            }
        }

        const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        makeMove(randomIndex);
    }
}

function checkWinner() {
    for (let pattern of winPatterns) {
        if (gameBoard[pattern[0]] === gameBoard[pattern[1]] && gameBoard[pattern[1]] === gameBoard[pattern[2]] && gameBoard[pattern[0]] !== '') {
            return true;
        }
    }
    return false;
}

function checkWinnerForBoard(board) {
    for (let pattern of winPatterns) {
        if (board[pattern[0]] === board[pattern[1]] && board[pattern[1]] === board[pattern[2]] && board[pattern[0]] !== '') {
            return true;
        }
    }
    return false;
}

function isBoardFull() {
    return gameBoard.every(cell => cell !== '');
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('board').innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => makeMove(i));
        cell.addEventListener('touchstart', () => makeMove(i));
        document.getElementById('board').appendChild(cell);
    }
    updateTurnIndicator();
    document.getElementById('result').innerText = '';
}

resetGame();