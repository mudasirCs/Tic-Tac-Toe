const gameBoard = (() => {
  let _gameBoard;
  const gameBoardInit = () => {
    _gameBoard = Array.from({ length: 3 }, () => Array(3).fill(""));
  };
  const fillBoardPosition = (x, y, mark) => {
    _gameBoard[x][y] = mark;
  };
  const getBoardPosition = (x, y) => _gameBoard[x][y];
  //   const checkBoardPosition = (x, y, mark) => (gameBoard[x][y] = mark ? 1 : 0);
  const isBoardBlank = () =>
    _gameBoard.every((row) => row.every((cell) => cell === ""));
  const isBoardFull = () =>
    _gameBoard.every((row) => row.every((cell) => cell !== ""));

  const checkBoardEmpty = (x, y) => (!_gameBoard[x][y] ? true : false);
  const checkBoardWin = () => {
    let mark;
    let streak = 0;

    // Check rows and columns
    for (let i = 0; i < 3; i++) {
      mark = _gameBoard[i][0];
      if (mark !== "") {
        streak = _gameBoard[i].reduce(
          (streak, val) => (val === mark ? streak + 1 : 0),
          0
        );
        if (streak === 3) return { win: 1, mark };
      }

      mark = _gameBoard[0][i];
      if (mark !== "") {
        streak = _gameBoard.reduce(
          (streak, val) => (val[i] === mark ? streak + 1 : 0),
          0
        );
        if (streak === 3) return { win: 1, mark };
      }
    }

    // Check diagonal and anti-diagonal
    mark = _gameBoard[0][0];
    if (mark !== "") {
      streak = _gameBoard.reduce(
        (streak, val, index) => (val[index] === mark ? streak + 1 : 0),
        0
      );
      if (streak === 3) return { win: 1, mark };
    }

    mark = _gameBoard[0][2];
    if (mark !== "") {
      streak = _gameBoard.reduce(
        (streak, val, index) => (val[2 - index] === mark ? streak + 1 : 0),
        0
      );
      if (streak === 3) return { win: 1, mark };
    }

    return { win: 0, mark: "" };
  };
  //use destructing to include some of the gameBoard function
  const resetBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        _gameBoard[i][j] = "";
      }
    }
  };

  return {
    gameBoardInit,
    fillBoardPosition,
    getBoardPosition,
    checkBoardEmpty,
    isBoardBlank,
    isBoardFull,
    checkBoardWin,
    resetBoard,
  };
})();

function createPlayer(name, mark, score = 0) {
  const player = {};
  player.name = name;
  player.mark = mark;
  player.score = score;
  const getPlayerName = () => player.name;
  const getPlayerMark = () => player.mark;
  const getPlayerScore = () => player.score;
  const playerReset = () => {
    player.score = 0;
  };
  const playerWon = () => {
    player.score += 1;
    alert(
      `${player.name} with ${player.mark} won! his score is ${player.score}`
    );
  };

  return {
    getPlayerName,
    getPlayerMark,
    getPlayerScore,
    playerReset,
    playerWon,
  };
}

const displayController = (() => {
  const _boardArray = gameBoard;
  const _boardReference = document.querySelector(".gameBoard");
  const _playerProfile1 = document.querySelector(".player:first-child");
  const _playerProfile2 = document.querySelector(".player:last-child");

  const renderBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const boardCell = document.createElement("div");
        boardCell.innerText = _boardArray.getBoardPosition(i, j);
        boardCell.classList.add("board-cell");
        boardCell.setAttribute("data-x", i);
        boardCell.setAttribute("data-y", j);
        _boardReference.appendChild(boardCell);
      }
    }
  };

  const renderBoardReset = () => {
    const boardCells = document.querySelectorAll(".gameBoard .board-cell");
    boardCells.forEach((cell) => {
      _boardReference.removeChild(cell);
    });
    renderBoard();
  };

  const renderPlayers = (p1, p2) => {
    _playerProfile1.firstElementChild.innerText = p1.getPlayerName();
    _playerProfile1.lastElementChild.innerText = p1.getPlayerMark();

    _playerProfile2.firstElementChild.innerText = p2.getPlayerName();
    _playerProfile2.lastElementChild.innerText = p2.getPlayerMark();
  };
  const renderNullTurn = () => {
    _playerProfile1.children[1].classList.remove("selectedPlayer");
    _playerProfile2.children[1].classList.remove("selectedPlayer");
  };
  const renderSetTurn = (p) => {
    if (_playerProfile1.firstElementChild.innerText == p.getPlayerName()) {
      _playerProfile1.children[1].classList.add("selectedPlayer");
    } else {
      _playerProfile2.children[1].classList.add("selectedPlayer");
    }
  };
  const renderToggleTurn = () => {
    _playerProfile1.children[1].classList.toggle("selectedPlayer");
    _playerProfile2.children[1].classList.toggle("selectedPlayer");
  };
  const renderSelectBox = (x, y, mark) => {
    const selectedCell = document.querySelector(
      `[data-x="${x}"][data-y="${y}"]`
    );
    selectedCell.innerHTML = mark;
  };
  const renderScore = (s1, s2) => {
    const score1 = document.querySelector(".score1");
    const score2 = document.querySelector(".score2");
    score1.innerText = s1;
    score2.innerText = s2;
  };

  return {
    renderBoard,
    renderBoardReset,
    renderPlayers,
    renderSetTurn,
    renderNullTurn,
    renderToggleTurn,
    renderSelectBox,
    renderScore,
  };
})();

const gameInstance = (() => {
  let _player1, _player2;
  const _gameBoard = gameBoard;
  const _displayController = displayController;
  let _currentPlayerTurn;
  let _gameOver;
  let _winningPlayer;
  let _winner;
  let _outOfTurns;

  function _gameInit() {
    _player1 = createPlayer("P1", "O");
    _player2 = createPlayer("P2", "X");
    _gameBoard.gameBoardInit();
    _displayController.renderBoard();
    _displayController.renderPlayers(_player1, _player2);
    _currentPlayerTurn = _randomPlayerTurn();
    _resetMatch();
  }
  //need to create clean util functions like clean states etc
  function _resetMatch() {
    const button = document.querySelector(".options button:last-child");
    button.addEventListener("click", () => {
      _clearBoard();
      _resetVariables();
      _resetPlayers();
      _playTurn();
    });
  }
  function _resetVariables() {
    _gameOver = 0;
    _outOfTurns = 0;
    _displayController.renderNullTurn();
    _currentPlayerTurn = _randomPlayerTurn();
  }
  function _clearBoard() {
    _gameBoard.resetBoard();
    _displayController.renderBoardReset();
  }
  function _resetPlayers() {
    _player1.playerReset();
    _player2.playerReset();
    _displayController.renderScore(
      _player1.getPlayerScore(),
      _player2.getPlayerScore()
    );
  }
  //add _gameOver when all slots filled
  function _gameRematch() {
    if (_gameOver || _outOfTurns) {
      _clearBoard();
      _outOfTurns = 0;
      _gameOver = 0;
      _playTurn();
    }
  }

  function _rematch() {
    const button = document.querySelector(".options button:first-child");
    button.addEventListener("click", () => {
      _gameRematch();
    });
  }
  //can include option for manual first turn
  //function has two functionalities randomizes and sets, not gd
  function _randomPlayerTurn() {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
      _displayController.renderSetTurn(_player1);
      return _player1;
    }
    _displayController.renderSetTurn(_player2);
    return _player2;
  }
  function _turnToggle() {
    _currentPlayerTurn = _currentPlayerTurn === _player1 ? _player2 : _player1;
    _displayController.renderToggleTurn();
  }

  function _playTurn() {
    const boardCells = document.querySelectorAll(".gameBoard .board-cell");
    boardCells.forEach((val) => {
      val.addEventListener("click", (e) => {
        if (e.target.innerText == "") {
          if (_gameOver) return;
          const x = parseInt(e.target.getAttribute("data-x"));
          const y = parseInt(e.target.getAttribute("data-y"));

          if (_gameBoard.checkBoardEmpty(x, y)) {
            let mark = _currentPlayerTurn.getPlayerMark();
            _displayController.renderSelectBox(x, y, mark);
            _gameBoard.fillBoardPosition(x, y, mark);
            e.target.classList.add("cell-clicked");
            _checkGameStatus();
            if (_outOfTurns) {
              alert("Draw");
              _rematch();
              return;
            }
            if (_gameOver) {
              alert(`${_gameOver}`);
              _setWinningPlayer(_winner);
              _showWinnerPlayer(_winner);
              _updateScore();
              _rematch();
              return;
            }
            _turnToggle();
          } else {
            // console.log(`Position (${x}, ${y}) is already occupied.`);
          }
        } else {
          // console.log("Cell is already occupied.");
        }
      });
    });
  }

  function _updateScore() {
    _displayController.renderScore(
      _player1.getPlayerScore(),
      _player2.getPlayerScore()
    );
  }

  function _checkGameStatus() {
    if (!_gameBoard.isBoardBlank()) {
      const { win, mark } = _gameBoard.checkBoardWin();
      _gameOver = win;
      _winner = mark;
    }
    if (_gameBoard.isBoardFull()) {
      _outOfTurns = 1;
    }
  }
  function _setWinningPlayer(mark) {
    if (_player1.getPlayerMark() == mark) {
      _winningPlayer = _player1;
    } else {
      _winningPlayer = _player2;
    }
  }
  function _showWinnerPlayer(mark) {
    _winningPlayer.playerWon();
  }
  const playGame = () => {
    _gameInit();
    _playTurn();
  };

  return { playGame };
})();

gameInstance.playGame();
// gameInstance.test();
