let UXModule = (() => {
// // Leaderboard

// let lForm = document.querySelector('.leaderboard-form');
// let lMain = document.querySelector('.leaderboard-main');

// // - Start button brings up form

// let startBtn = document.querySelector('.start');

// startBtn.addEventListener('click', () => {
//   // Hide start button
//   startBtn.style.animation = '.2s disappear ease-out';
//   setTimeout(() => { startBtn.style.display = 'none'; }, 200);

//   // Show leaderboard form
//   lForm.style.display = 'block';
//   lForm.style.animation = '1s slide-up-show ease';
//   lForm.style.animationDelay = '.1s';
//   lForm.style.animationFillMode = 'forwards';
//   setTimeout(() => { lForm.style.marginTop = '0'; }, 1100);
// });

// // - Switch between Person or Computer opponent
// // Will add tracker if I don't use the display property as such.

// let pBtn = document.querySelector('.p-icon');
// let cBtn = document.querySelector('.c-icon');
// let pOption = document.querySelector('.person-option');
// let cOption = document.querySelector('.computer-option');

// cBtn.addEventListener('click', () => {
//   switchOpponent(pOption, cOption, 0);
// });

// pBtn.addEventListener('click', () => {
//   switchOpponent(cOption, pOption);
// });

// function switchOpponent (current, next, resize) {
//   // Hide current option
//   current.style.animation = '.5s hide-option ease';
//   if (resize == 0) {
//     current.style.animation = '.5s hide-option ease, .5s resize-shrink ease-in-out';
//   }
//   else {
//     current.style.animation = '.5s hide-option ease, .5s resize-expand ease-in-out';
//   }
//   setTimeout(() => {
//     current.style.display = 'none'; 
//   }, 500);

//   // Show next option
//   setTimeout(() => {     
//     next.style.display = 'block';
//     next.style.animation = '.5s show-option ease';
//   }, 500);  
// }

// // - Form Brings up main

// let beginBtn = document.querySelector('.begin');

// beginBtn.addEventListener('click', () => {
//   // Need to add player creation and game initiation here - LATER
//   // Also: reset form with separate function

//   // Hide form
//   lForm.style.animation = '1s slide-up-hide ease-out';
//   setTimeout(() => { lForm.style.display = 'none'; }, 1000);
  
//   // Show main
//   lMain.style.display = 'flex';
// });

// // - Reseting 

// // -- Reseting Score 
// // Will need to trigger game reset and score deletion

// let resetS = document.querySelector('.score-only');

// // Nothing yet because it doesn't require animation
// // resetS.addEventListener('click', () => {

// // });

// // -- Reseting All
// // Will trigger function from above reset + name reset

// let resetA = document.querySelector('.name-score');

// resetA.addEventListener('click', () => {
//   // Show form
//   lForm.style.display = 'block';
//   cOption.style.display = 'none';
//   cOption.style.animation = 'none';
//   pOption.style.display = 'block';
//   pOption.style.animation = 'none';
//   lForm.style.animation = '1s slide-down-show ease-out';

//   setTimeout(() => {
//     // Hide main and secure form
//     lMain.style.display = 'none'; 
//   }, 1000);

// });

// // Play again / Game Over
// // Will not be shown with an event listener, only hidden.
// // Add reset

// let replayBtn = document.querySelector('.replay');
// let gameOver = document.querySelector('.game-over')

// replayBtn.addEventListener('click', () => {
//   // Hide game over
//   gameOver.style.animation = '.5s slide-up-hide-replay ease-out';
//   setTimeout(() => { gameOver.style.display = 'none'; }, 500);
// });

// Board

// - Spot hover

let emptySpots = document.querySelectorAll('.empty');
for (let emptySpot of emptySpots) {
  // Show spotPlaceholder
  emptySpot.addEventListener('mouseenter', (e) => {
    //Add condition that game is in progress
    let spotPlaceholder = document.createElement('div');
    spotPlaceholder.classList.add('spotPlaceholder');

    let sTop = document.createElement('div');
    sTop.classList.add('spotPlaceholder-top');

    let sBottom = document.createElement('div');
    sBottom.classList.add('spotPlaceholder-bottom');

    spotPlaceholder.appendChild(sTop);
    spotPlaceholder.appendChild(sBottom);
    e.target.appendChild(spotPlaceholder);
  });
  // Hide spotPlaceholder
  emptySpot.addEventListener('mouseleave', (e) => {
    removeSpotspotPlaceholder(e.target);
  });
}

function removeSpotspotPlaceholder(spot) {
  spot.removeChild(spot.querySelector('.spotPlaceholder'));
}

})();

//
//<img src="assets/images/x-piece.png" style="width: 90%" alt="Xpiece">
//<img src="assets/images/o-piece.png" style="width: 90%" alt="opiece">