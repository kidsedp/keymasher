const BACKGROUND_CLR = 200;
const GRID_CLR = 0;
const NUM_CELLS = 10;
const COIN_CLR = '#ffff00';

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const DIRS = [LEFT, UP, RIGHT, DOWN];

var gridSize;
var brain;
var score = 0;

var player, coin;

function setup() {
	let canvas = createCanvas(600, 600);
  canvas.parent('board-container');

	gridSize = width / NUM_CELLS;
  player = new Entity(0);
  coin = new Entity(COIN_CLR);
  player.randomizePosition();
  do {
    coin.randomizePosition();
  } while (player.samePositionAs(coin));

	brain = new Brain();

  initDOM();
}

function draw() {
	background(BACKGROUND_CLR);
  drawBoard();
  player.show();
  coin.show();
}

function drawBoard() {
	stroke(GRID_CLR);
	for (let i = 1; i <= NUM_CELLS; i++) {
		line(0, gridSize * i, width, gridSize * i);
		line(gridSize * i, 0, gridSize * i, height);
	}
}

function keyPressed() {
	makeMove(keyCode);
}

function makeMove(code) {
  let move = brain.getMove(code);
  let originalDist = player.distanceFrom(coin);
  
  switch (move) {
    case UP:
      player.move(0, -1);
      break;
    case RIGHT:
      player.move(1, 0);
      break;
    case DOWN:
      player.move(0, 1);
      break;
    case LEFT:
      player.move(-1, 0);
      break;
    default:
      break;
  }
  
  let newDist = player.distanceFrom(coin);
  
  if (newDist < originalDist) {
    brain.reward(code);
  } else {
    brain.punish(code);
  }
  
  if (player.samePositionAs(coin)) {
    score++;
    updateScore(score);
    do {
      coin.randomizePosition();
    } while (player.samePositionAs(coin));
  }

  updateStats();
}
