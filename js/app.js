/**
 * app.js
 *
 * Main entrypoint for the game. Location for all of p5.js's hooks and the
 * overall game logic.
 *
 * @see dom.js     For DOM interaction (stats, game score)
 * @see entity.js  For token objects (i.e. the cat, the mouse)
 * @see brain.js   For the reinforcement learning logic
 */

// The number of cells on either dimension of the board. (The board is always
// square).
const NUM_CELLS = 10;

/**
 * Colour constants -- using _CLR to avoid annoying UK/US spelling differences
 */
const BACKGROUND_CLR = '#d9c7c0';
const COIN_CLR = '#ffff00';
const GRID_CLR = 0;
const PLAYER_CLR = 0;

/**
 * Direction constants -- these are the same as the settings in Processing.
 */
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const DIRS = [LEFT, UP, RIGHT, DOWN];

/**
 * Variables that need to wait to be set until p5.js is read to set up the
 * environment
 */
var gridSize;  // The size of the space between two lines of the grid
var brain;     // The object that determines which moves should be made
var cat;       // The representation of the cat's token
var mouse;     // The representation of the goal token

var score = 0;  // The score starts at 0

var catImage, mouseImage;

function preload() {
  catImage = loadImage('img/cat.svg');
  mouseImage = loadImage('img/mouse.svg');
}

/**
 * Sets up the environment. Called by p5.js
 */
function setup() {
	let canvas = createCanvas(600, 600);
  canvas.parent('board-container');

  if (localStorage.hasOwnProperty('keymasher_score')) {
    score = parseInt(localStorage.getItem('keymasher_score'));
  }

  // Since the canvas size is available now, set the grid size based on the
  // number of desired cells.
	gridSize = width / NUM_CELLS;

  // Initialize all of the game objects.
  cat   = new Entity(catImage);
  mouse = new Entity(mouseImage);
	brain = new Brain();

  // Set the cat's position, then set the mouse's, ensuring that they aren't
  // at the same spot.
  cat.randomizePosition();

  do {
    mouse.randomizePosition();
  } while (cat.samePositionAs(mouse));

  // @see dom.js
  initDOM(brain, score);
}

/**
 * Draws a single frame of the game. Called by p5.js
 */
function draw() {
	background(BACKGROUND_CLR);
  drawBoard();
  cat.show();
  mouse.show();
}

/**
 * Draws the board on the screen
 */
function drawBoard() {
	stroke(GRID_CLR);
	for (let i = 1; i <= NUM_CELLS; i++) {
		line(0, gridSize * i, width, gridSize * i);
		line(gridSize * i, 0, gridSize * i, height);
	}
}

/**
 * Callback function for when a key is pressed. Called by p5.js
 */
function keyPressed() {
  if (isValidKey(keyCode)) {
    makeMove(keyCode);

    // Prevent the browser from doing any funny business with the event
    return false;
  }
}

/**
 * Makes a move in the game, and triggers all the logic associated with it.
 *
 * @param code  The key code that was pressed
 */
function makeMove(code) {
  // Determine which direction the brain thinks it should move, based on the
  // key code
  let move = brain.getMove(code);

  // Save the original distance for comparison later
  let originalDist = cat.distanceFrom(mouse);
  
  // Actually move the cat
  switch (move) {
    case UP:
      cat.move(0, -1);
      break;
    case RIGHT:
      cat.move(1, 0);
      break;
    case DOWN:
      cat.move(0, 1);
      break;
    case LEFT:
      cat.move(-1, 0);
      break;
    default:
      break;
  }
  
  // Figure out the new distance
  let newDist = cat.distanceFrom(mouse);

  // If the new distance is closer than before, the guess was correct and the
  // brain should reward itself. Otherwise, it was wrong and the brain should
  // punish itself.
  if (newDist < originalDist) {
    brain.reward(code);
  } else {
    brain.punish(code);
  }
  
  // Check if the mouse was reached, and call the associated method if so
  if (cat.samePositionAs(mouse)) {
    onCoinReached();
  }

  // Update the brain's statistics in the DOM
  // @see dom.js
  updateStats(brain);

  // Save the current stats
  brain.save();
}

/**
 * Routine for when the mouse is found by the cat
 *
 * Increments the score, triggers a DOM update of the score, and moves the mouse
 * to a new location
 */
function onCoinReached() {
  score++;
  updateScore(score);
  do {
    mouse.randomizePosition();
  } while (cat.samePositionAs(mouse));
}

function isValidKey(code) {
  return DIRS.includes(code) || String.fromCharCode(code).match(/^[A-Z\d]$/);
}

/**
 * Resets all the game variables
 */
function resetGame() {
  brain.reset();
  updateStats(brain);
  score = 0;
  updateScore(score);
}
