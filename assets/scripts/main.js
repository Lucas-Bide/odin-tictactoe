let Application = (() => {
  // Tic Tac Toe Game
  let player = (name) => { return { name, wins: 0 }; }

  let gameFactory = () => {
    let player1, player2;
    let winner = 0 // -1:p1, 0:tie, 1:p2
    let gameOver = false;
    let spots = ['','','','','','','','',''];
    let turn; // true:p1, false:p2
    
    function checkH() {
      let hLines = [spots[0] + spots[1] + spots[2], spots[3] + spots[4] + spots[5], spots[6] + spots[7] + spots[8]];
      return check(hLines);
    }
    
    function checkV() {
      let vLines = [spots[0] + spots[3] + spots[6], spots[1] + spots[4] + spots[7], spots[2] + spots[5] + spots[8]];
      return check(vLines);
    }
    
    function checkD() {
      let dLines = [spots[0] + spots[4] + spots[8], spots[2] + spots[4] + spots[6]];
      return check(dLines);
    }
    
    function check(lines) {
      let result = true;
      if (lines.includes('xxx')) {
        winner = -1;
        player1.wins += 1;
      }
      else if (lines.includes('ooo')) {
        winner = 1;
        player2.wins += 1;
      }
      else {
        result = false;
      }
      return result;
    }

    function isGameOver() {
      let result = !spots.includes('');
      if (checkH() || checkD() || checkV()) {
        result = true;
      }
      gameOver = result;
      return result;
    }

    function newMatch() {
      gameOver = false;
      removePieces();
      spots = ['','','','','','','','',''];
      setTurn();
      announceTurn(turn);
      addSpotListeners();
    }

    function setTurn() {
      turn = Math.floor(Math.random() * 2) == 0;
    }
    

    return {
      setPlayer1: (player) => {
        player1 = player;
      },
      setPlayer2: (player) => {
        player2 = player;
      },
      resetScore: () => {
        player1.wins = 0;
        player2.wins = 0;
        updateLeaderboard();
        if (gameOver) {
          replayBtn.dispatchEvent(new Event('click'));
        } 
        else {
          newMatch();
        }
      },
      takeTurn: (spot) => {
        if (!gameOver) {
          let piece =  turn ? 'x' : 'o';
          spots[spot] = piece;
          addPiece(piece, spot);
          turn = !turn;
          announceTurn(turn);
        }
        if (!gameOver && isGameOver()) {
          showGameOver();
          announceStatus(1);
          updateLeaderboard();
          for (let spot of document.querySelectorAll('.spot')) {
            removeSpotListeners(spot);
          }
        } 
      },
      newMatch: newMatch, 
      checkGameOver:  () => {
        return gameOver; 
      }
    }
  } 

  let game, p1, p2;


  // Leaderboard

  let lForm = document.querySelector('.leaderboard-form');
  let lMain = document.querySelector('.leaderboard-main');

  // - Start button brings up form

  let startBtn = document.querySelector('.start');

  startBtn.addEventListener('click', () => {
    // Hide start button
    startBtn.style.animation = '.2s disappear ease-out';
    setTimeout(() => { startBtn.style.display = 'none'; }, 200);

    // Show leaderboard form
    lForm.style.display = 'block';
    lForm.style.animation = '1s slide-up-show ease';
    lForm.style.animationDelay = '.1s';
    lForm.style.animationFillMode = 'forwards';
    setTimeout(() => { lForm.style.marginTop = '0'; }, 1100);

    announceStatus(0);
  });

  // - Switch between Person or Computer opponent
  // Will add tracker if I don't use the display property as such.

  let pBtn = document.querySelector('.p-icon');
  let cBtn = document.querySelector('.c-icon');
  let pOption = document.querySelector('.person-option');
  let cOption = document.querySelector('.computer-option');

  cBtn.addEventListener('click', () => {
    switchOpponent(pOption, cOption, 0);
  });

  pBtn.addEventListener('click', () => {
    switchOpponent(cOption, pOption);
  });

  function switchOpponent (current, next, resize) {
    // Hide current option
    current.style.animation = '.5s hide-option ease';
    if (resize == 0) {
      current.style.animation = '.5s hide-option ease, .5s resize-shrink ease-in-out';
    }
    else {
      current.style.animation = '.5s hide-option ease, .5s resize-expand ease-in-out';
    }
    setTimeout(() => {
      current.style.display = 'none'; 
    }, 500);

    // Show next option
    setTimeout(() => {     
      next.style.display = 'block';
      next.style.animation = '.5s show-option ease';
    }, 500);  
  }

  // - Form Brings up main

  let beginBtn = document.querySelector('.begin');

  beginBtn.addEventListener('click', () => {
    p1Input = document.querySelector('#p1');
    p2Input = document.querySelector('#p2')
    
    // Initiate game
    game = gameFactory();
    p1 = player(p1Input.value || 'Player 1');

    p2 = player(p2Input.value || 'Player 2');
    game.setPlayer1(p1);
    game.setPlayer2(p2);
    game.newMatch();
    updateLeaderboard();

    // Hide & reset form
    lForm.style.animation = '1s slide-up-hide ease-out';
    setTimeout(() => { 
      lForm.style.display = 'none'; 
      p1Input.value = '';
      p2Input.value = '';
    }, 1000);
    
    // Show main
    lMain.style.display = 'flex';
  });

  // - Reseting 

  // -- Reseting Score 
  // Will need to trigger game reset and score deletion

  let resetS = document.querySelector('.score-only');

  // Nothing yet because it doesn't require animation
  resetS.addEventListener('click', () => {
    game.resetScore();
  });

  // -- Reseting All
  // Will trigger function from above reset + name reset

  let resetA = document.querySelector('.name-score');

  resetA.addEventListener('click', () => {
    // Show form
    lForm.style.display = 'block';
    cOption.style.display = 'none';
    cOption.style.animation = 'none';
    pOption.style.display = 'block';
    pOption.style.animation = 'none';
    lForm.style.animation = '1s slide-down-show ease-out';

    setTimeout(() => {
      // Hide main and secure form
      lMain.style.display = 'none'; 
    }, 1000);

  });

  // - Update Leaderboard

  function updateLeaderboard() {
    let p1Name = document.querySelector('.player1 .name');
    let p1Score = document.querySelector('.player1 .score');
    let p2Name = document.querySelector('.player2 .name');
    let p2Score = document.querySelector('.player2 .score');

    p1Name.textContent = p1.name;
    p1Score.textContent = p1.wins;
    p2Name.textContent = p2.name;
    p2Score.textContent = p2.wins;
  }

  // Play again / Game Over
  // Will not be shown with an event listener, only hidden.

  let replayBtn = document.querySelector('.replay');
  let gameOver = document.querySelector('.game-over')

  replayBtn.addEventListener('click', () => {
    // Hide game over
    gameOver.style.animation = '.5s slide-up-hide-replay ease-out';
    setTimeout(() => { gameOver.style.display = 'none'; }, 500);

    game.newMatch();
  });

  function showGameOver() {
    gameOver.style.display = 'block';
    gameOver.style.animation = '.5s slide-up-show-replay ease-out';
  }

  // Board

  // - Spot

  function addSpotListeners() {
    let spots = document.querySelectorAll('.spot');
    for (let spot of spots) {
      // Show spotPlaceholder
      spot.addEventListener('mouseenter', showPlaceholder);
      // Hide spotPlaceholder
      spot.addEventListener('mouseleave', removeSpotPlaceholder);
      // Hide spotPlaceholder on click for turn;
      spot.addEventListener('click', clickSpot);
    }
  }

  function showPlaceholder(e) {
    let spot = e.target;
    let spotPlaceholder = document.createElement('div');
    spotPlaceholder.classList.add('spotPlaceholder');
    spotPlaceholder.setAttribute('data-index', spot.getAttribute('data-index'));

    let sTop = document.createElement('div');
    sTop.classList.add('spotPlaceholder-top');

    let sBottom = document.createElement('div');
    sBottom.classList.add('spotPlaceholder-bottom');

    spotPlaceholder.appendChild(sTop);
    spotPlaceholder.appendChild(sBottom);
    spot.appendChild(spotPlaceholder);
  }

  function removeSpotPlaceholder(e, toggle=false) {
    let spot = toggle ? e : e.target;
    let ph = spot.querySelector('.spotPlaceholder');
    if (ph) {
      spot.removeChild(ph);
    }
  }

  function clickSpot(e) {
    let spot = e.target;
    if (!spot.classList.contains('spot')) {
      let spots = document.querySelectorAll('.spot');
      for (let spotty of spots) {
        if (spotty.getAttribute('data-index') == spot.parentElement.getAttribute('data-index')) {
          spot = spotty;
          e.target = spot;
          break;
        }
      }
    }
    removeSpotListeners(spot);
    game.takeTurn(spot.getAttribute('data-index'))
  }

  function removeSpotListeners(spot) {
    spot.removeEventListener('mouseenter', showPlaceholder);
    spot.removeEventListener('click', clickSpot);
    removeSpotPlaceholder(spot, true);
  }

  // - Piece manipulation

  function addPiece(mark, position) {
    let spots = document.querySelectorAll('.spot');
    let spot;
    for (let spotty of spots) {
      if (spotty.getAttribute('data-index') == position) {
        spot = spotty;
        break;
      } 
    }
    let piece = document.createElement('img')
    piece.setAttribute('src', 'assets/images/' + mark + '-piece.png');
    piece.classList.add('piece');
    piece.style.width = '90%';
    piece.setAttribute('alt', mark + ' piece');
    spot.appendChild(piece);
  }

  function removePieces() {
    let spots = document.querySelectorAll('.spot');
    for (let spot of spots) {
      let piece = spot.querySelector('.piece');
      if (piece)
      spot.removeChild(piece);
    }
  }

  // - Turn Status

  let status = document.querySelector('.status-message');
  function announceTurn(turn) {
    status.textContent = (turn ? p1.name : p2.name) + "'s Turn";
  }
  function announceStatus(stat) {
    if (stat == 1) {
      status.textContent = 'Game Over';
    }
    else {
      status.textContent = 'On Standby';
    }
  }

})();

//
//<img src="assets/images/x-piece.png" style="width: 90%" alt="Xpiece">
//<img src="assets/images/o-piece.png" style="width: 90%" alt="opiece">