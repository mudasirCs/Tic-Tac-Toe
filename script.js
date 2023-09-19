const gameBoard = (() => {
  let _gameBoard;
  const _gameBoardInit = () => {
    _gameBoard = Array.from({ length: 3 }, () => Array(3).fill(""));
  };
  const fillBoardPosition = (x, y, mark) => {
    _gameBoard[x][y] = mark;
  };
  const getBoardPosition = (x, y) => _gameBoard[x][y];
  //   const checkBoardPosition = (x, y, mark) => (gameBoard[x][y] = mark ? 1 : 0);
  const checkBoardEmpty = (x, y) => (!_gameBoard[x][y] ? true : false);
  const checkBoardWin = () => {
    //add genrator iterable logic in future
    /**
       X 0 X
      0 X 0
      0 0 X 

      1 1 1
      2 2 2
      2 2 3
      */
    //check rows
    let mark = "";
    let streak = 0;
    let win = 0;
    for (let i = 0; i < 3; i++) {
      mark = _gameBoard[i][0];
      streak = _gameBoard[i].reduce((streak, val) => {
        return val == mark ? ++streak : 0;
      }, 0);
      if (streak == 3) return { win: 1, mark };
    }
    //check columns
    for (let i = 0; i < 3; i++) {
      mark = _gameBoard[0][i];
      streak = _gameBoard.reduce((streak, val) => {
        return val[i] == mark ? ++streak : 0;
      }, 0);
      if (streak == 3) return { win: 1, mark };
    }
    //check diagonal
    mark = _gameBoard[0][0];
    streak = _gameBoard.reduce((streak, val, index) => {
      return val[index] == mark ? ++streak : 0;
    }, 0);
    if (streak == 3) return { win: 1, mark };
    //check anti-diagonal
    mark = _gameBoard[0][2];
    streak = _gameBoard.reduce((streak, val, index) => {
      return val[2 - index] == mark ? ++streak : 0;
    }, 0);
    if (streak == 3) return { win: 1, mark };

    return { win: 0, mark };
  };
  const resetBoard = () => {
    _gameBoardInit();
  };

  return {
    fillBoardPosition,
    getBoardPosition,
    checkBoardEmpty,
    checkBoardWin,
    resetBoard,
  };
})();

function createPlayer(name, mark) {
  const player = {};
  player.name = name;
  player.mark = mark;
  const getPlayerName = () => player.name;
  const getPlayerMark = () => player.mark;
  const playerReset = (name, mark) => {
    player.name = name || "";
    player.mark = mark || "";
  };
  const playerWon = () => {
    console.log(`${player.name} with ${player.mark} Won!`);
  };

  return { getPlayerName, getPlayerMark, playerReset, playerWon };
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
        _boardReference.appendChild(boardCell);
      }
    }
  };
  const renderPlayers = (p1, p2) => {
    _playerProfile1.firstElementChild.innerText = p1.getPlayerName();
    _playerProfile1.lastElementChild.innerText = p1.getPlayerMark();

    _playerProfile2.firstElementChild.innerText = p2.getPlayerName();
    _playerProfile2.lastElementChild.innerText = p2.getPlayerMark();
  };
  const renderSetTurn = (p) => {
    // console.log(_playerProfile1.firstElementChild.innerText);
    // console.log(p.getPlayerName());
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
  const renderSelectBox = (mark) => {
    const boardCells = document.querySelectorAll(".gameBoard .board-cell");
    boardCells.forEach((val) => {
      val.addEventListener("click", (e) => {
        e.target.innerText = mark;
      });
    });
  };

  //  const renderScore = (score) => {};
  //maybe make an init function and hide away some functions
  return {
    renderBoard,
    renderPlayers,
    renderSetTurn,
    renderToggleTurn,
    renderSelectBox,
  };
})();

const gameInstance = (() => {
  let _player1, _player2;
  const _gameBoard = gameBoard;
  const _displayController = displayController;
  let _currentPlayerTurn;
  let _gameOver;
  let _winner;
  let _score;

  //
  function _gameInit() {
    _player1 = createPlayer("P1", "O");
    _player2 = createPlayer("P2", "X");
    _gameBoard.resetBoard();
    // document.addEventListener("DOMContentLoaded", function () {
    _displayController.renderBoard();
    _displayController.renderPlayers(_player1, _player2);
    _currentPlayerTurn = _randomPlayerTurn();
    //_displayController.renderScore();
    // });
  }

  // const test = () => {
  //   player tests complete
  // };

  function _gameReset() {
    _gameBoard.resetBoard();
    _player1.playerReset();
    _player2.playerReset();
    _displayController.renderBoard();
    _currentPlayerTurn = _randomPlayerTurn();
  }
  //can include option for manual first turn
  function _randomPlayerTurn() {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
      alert("random player is 1 rn");
      _displayController.renderSetTurn(_player1);
      return _player1;
    }
    alert("random player is 2 rn");
    _displayController.renderSetTurn(_player2);
    return _player2;
  }
  function _turnToggle() {
    _currentPlayerTurn = _currentPlayerTurn === _player1 ? _player2 : _player1;
    _displayController.renderToggleTurn();
  }
  function _playTurn() {
    // document.addEventListener("DOMContentLoaded", function () {
    // if (_currentPlayerTurn) {
    _displayController.renderSelectBox(_currentPlayerTurn.getPlayerMark());
    setTimeout(() => {
      _turnToggle();
    }, 1000);
    // } else {
    //   console.error("_currentPlayerTurn is not defined");
    // }
    // });
  }
  const playGame = () => {
    //prompt for player names later
    _gameInit();
    _playTurn();
    // setTimeout(_turnToggle(), 5000);
    // while (!_gameOver) {
    //   _playTurn();
    //   result = _gameBoard.checkBoardWin();
    //   _gameOver = result[0];
    //   _winner = result[1];
    // }
  };

  return { playGame };
})();

gameInstance.playGame();
// gameInstance.test();
