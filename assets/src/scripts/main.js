// let Application = (() => {
  // Tic Tac Toe Game
  let player = (name) => { 
    return { name, wins: 0 }; 
  }

  let gameFactory = (p1, p2) => {
    let player1 = p1;
    let player2 = p2; 
    let winner = 0; // -1:p1, 0:tie, 1:p2
    let gameOver = false;
    let spots = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
    let turn = Math.floor(Math.random() * 2) == 0; // true:p1, false:p2
    let isComp = false; // versing computer
    
    function checkH() {
      let hLines = getHLines();
      return check(hLines);
    }
    
    function checkV() {
      let vLines = getVLines();
      return check(vLines);
    }
    
    function checkD() {
      let dLines = getDLines();
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
        winner = 0;
      }
      return result;
    }

    function checkGameOver() {
      return gameOver; 
    }

    function getHLines() {
      return [spots[0] + spots[1] + spots[2], spots[3] + spots[4] + spots[5], spots[6] + spots[7] + spots[8]];
    }
    function getVLines() {
      return [spots[0] + spots[3] + spots[6], spots[1] + spots[4] + spots[7], spots[2] + spots[5] + spots[8]];
    }
    function getDLines() {
      return [spots[0] + spots[4] + spots[8], spots[2] + spots[4] + spots[6]];
    }

    function isGameOver() {
      let result = !spots.includes(' ');
      if (checkH() || checkD() || checkV()) {
        result = true;
      }
      gameOver = result;
      return result;
    }

    function newMatch(comp=false) {
      gameOver = false;
      removePieces();
      spots = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
      setTurn();
      announceTurn(turn);
      addSpotListeners();
      isComp = comp;
      if (isComp && !turn) {
        compTurn();
      }
    }


    function setTurn() {
      turn = Math.floor(Math.random() * 2) == 0;
    }

    function takeTurn(spot) {
      if (!gameOver) {
        let piece =  turn ? 'x' : 'o';
        spots[spot] = piece;
        addPiece(piece, spot);
        turn = !turn;
        announceTurn(turn);
      }
      if (!gameOver && isGameOver()) {
        showGameOver(winner);
        announceStatus(1);
        updateLeaderboard();
        for (let spot of document.querySelectorAll('.spot')) {
          removeSpotListeners(spot);
        }
      } 
    }

    function takeTurnX(spot) {
      takeTurn(spot);
      compTurn();
    }

    function compTurn() {
      // Determine priorities of each available spot
      // Randomly select a spot from the group of lowest priority
      // call takeTurn
      let spotsP = spotPriorities();
      let spot = spotsP[Math.floor(Math.random() * spotsP.length)];
      removeSpotListeners(positionToSpot(spot));
      takeTurn(spot);
    }

    function spotPriorities() {
      // go from -1 to 4, 4 being highest priority.
      // index corresponds to index in spots.
      let positionPriorities = [-1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1];
      let priority = -1;
      let validSpots = [];

      // check horizontal patterns
      let hLines = getHLines();

      for (let i = 0; i < 3; i++) {
        let { linePriority, ePositions }  = calculateLinePriority(hLines[i]);
        if (linePriority > priority) {
          priority = linePriority;
        }
        if (linePriority === -1) {
          continue;
        }
        let offset = i + i* 2;
        for (let position of ePositions) {
          if (positionPriorities[offset + position] < linePriority) {
            positionPriorities[offset + position] = linePriority;
          }
        }
      }

      // check vertical patterns
      let vLines = getVLines();

      for (let i = 0; i < 3; i++) {
        let { linePriority, ePositions }  = calculateLinePriority(vLines[i]);
        if (linePriority > priority) {
          priority = linePriority;
        }
        if (linePriority === -1) {
          continue;
        }
        let offset = i;
        for (let position of ePositions) {
          let positionOffset = position === 0 ? 0 : position === 1 ? 3 : 6;
          if (positionPriorities[offset + positionOffset] < linePriority) {
            positionPriorities[offset + positionOffset] = linePriority;
          }
        }
      }

      // check diagonal patterns
      let dLines = getDLines();

      for (let i = 0; i < 2; i++) {
        let { linePriority, ePositions }  = calculateLinePriority(dLines[i]);
        if (linePriority > priority) {
          priority = linePriority;
        }
        if (linePriority === -1) {
          continue;
        }
        let offset = i === 0 ? [0, 4, 8] : [2, 4, 6];
        for (let position of ePositions) {
          let positionOffset = offset[position];
          if (positionPriorities[positionOffset] < linePriority) {
            positionPriorities[positionOffset] = linePriority;
          }
        }
      }

      for (let i = 0; i < 9; i++) {
        if (positionPriorities[i] === priority) {
          validSpots.push(i);
        }
      }
      return validSpots;
    }

    function calculateLinePriority(line) {
      let priority = 0;
      let ePositions = [];
      let e = 0; // empty spot
      let x = 0; 
      let o = 0;
      let parts = line.split('');
      for (let i = 0; i < 3; i++) {
        if (parts[i] == 'o') {
          o++;
        }
        else if (parts[i] == 'x') {
          x++;
        }
        else {
          e++;
          ePositions.push(i);
        }
      }

      if (e === 0) {
        priority = -1;
      }
      else if (e === 1) {
        if (x === 2) {
          priority = 3;
        }
        else if (o === 2) {
          priority = 4;
        }
        else {
          priority = 2;
        }
      }
      else if (e === 2) {
        if (x === 1) {
          priority = 1;
        }
        else {
          priority = 2;
        }
      } // priority remains 0 for e = 3
      return { linePriority: priority, ePositions };
    }

    function resetScore() {
      player1.wins = 0;
      player2.wins = 0;
      updateLeaderboard();
      removePieces();
      if (gameOver) {
        replayBtn.dispatchEvent(new Event('click'));
      } 
      else {
        newMatch(isComp);
      }
    }

    function vComp() {
      return isComp;
    }

    return {
      checkGameOver,
      newMatch, 
      resetScore,
      takeTurn,
      takeTurnX,
      vComp
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
      let p2Input = document.querySelector('#p2');
      p2Input.style.animation = '.5s shrink-input ease';
      setTimeout(() => { p2Input.style.animation = 'none'; }, 500);
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
    let p1Input = document.querySelector('#p1');
    let p2Input = document.querySelector('#p2');
    
    // Initiate game
    p1 = player(p1Input.value || 'Player 1');
    let isVsComp;
    if (document.querySelector('.person-option').style.display == 'none') {
      p2 = player('Roboputer');
      isVsComp = true;
    }
    else {
      p2 = player(p2Input.value || 'Player 2');
      isVsComp = false;
    }    
    game = gameFactory(p1, p2);
    game.newMatch(isVsComp);
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
    
    removePieces();
    for (let spot of document.querySelectorAll('.spot')) {
      removeSpotListeners(spot);
    }

    setTimeout(() => {
      // Hide main and secure form
      lMain.style.display = 'none'; 
    }, 1000);

    // Hide gameover if visible 
    if (gameOver.style.display == 'block') {
      gameOver.style.animation = '.5s slide-up-hide-replay ease-out';
      setTimeout(() => { gameOver.style.display = 'none'; }, 500);
    }

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

    if (game.vComp) {
      game.newMatch(true);
    }
    else {
      game.newMatch();
    }
  });

  function showGameOver(stat) {
    gameOver.style.display = 'block';
    gameOver.style.animation = '.5s slide-up-show-replay ease-out';
    let result = gameOver.querySelector('.result');
    result.textContent =  'Game over! ' + (stat == 1 ? p2.name + " Won!" : stat == 0 ? 'It was a Tie!' : p1.name + ' Won!');
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
      spot = positionToSpot(spot.parentElement.getAttribute('data-index'));
    }
    removeSpotListeners(spot);
    if(game.vComp()) {
      game.takeTurnX(spot.getAttribute('data-index'));
    }
    else {
      game.takeTurn(spot.getAttribute('data-index'));
    }
  }

  function removeSpotListeners(spot) {
    spot.removeEventListener('mouseenter', showPlaceholder);
    spot.removeEventListener('click', clickSpot);
    removeSpotPlaceholder(spot, true);
  }

  // - Piece manipulation

  function addPiece(mark, position) {
    let spot = positionToSpot(position);
    let piece = document.createElement('img')
    piece.setAttribute('src', 'assets/dist/images/' + mark + '-piece.png');
    piece.classList.add('piece');
    piece.style.width = '90%';
    piece.setAttribute('alt', mark + ' piece');
    spot.appendChild(piece);
  }

  function removePieces() {
    let spots = document.querySelectorAll('.spot');
    for (let spot of spots) {
      let piece = spot.querySelector('.piece');
      if (piece) {
        spot.removeChild(piece);
      }
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

  // Misc

  function positionToSpot (position) {
    let spots = document.querySelectorAll('.spot');
    let spot;
    for (let spotty of spots) {
      if (spotty.getAttribute('data-index') == position) {
        spot = spotty;
        break;
      } 
    }
    return spot;
  }

// })();
