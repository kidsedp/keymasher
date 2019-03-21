const BACKGROUND_CLR = 200;
const GRID_CLR = 0;
const NUM_CELLS = 10;
const COIN_CLR = '#ffff00';

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const DIRS = [LEFT, UP, RIGHT, DOWN];
const DIR_STRINGS = ['Left', 'Up', 'Right', 'Down'];

var gridSize;
var playerX, playerY;
var coinX, coinY;
var brain;

var statsNode;
var scoreNode;
var showStats = false;
var score = 0;

function setup() {
	let canvas = createCanvas(600, 600);
	gridSize = width / NUM_CELLS;
	playerX = NUM_CELLS / 2;
	playerY = NUM_CELLS / 2;
	placeCoin();

	brain = new Brain();
  canvas.parent('board-container');

  let scoreNodeArea = createP('Score: ');
  scoreNodeArea.parent('stats-container');
  scoreNode = createSpan(0);
  scoreNode.parent(scoreNodeArea);

  statsNode = createDiv();
  statsButton = createButton('Show stats');
  statsButton.parent('stats-container');
  statsButton.mouseClicked(() => {
    if (showStats) {
      statsNode.addClass('hidden');
      showStats = false;
      statsButton.html('Show stats');
    } else {
      statsNode.removeClass('hidden');
      showStats = true;
      statsButton.html('Hide stats');
    }
  });
  statsNode.parent('stats-container');
}

function draw() {
	background(BACKGROUND_CLR);

	stroke(GRID_CLR);
	for (let i = 1; i <= NUM_CELLS; i++) {
		line(0, gridSize * i, width, gridSize * i);
		line(gridSize * i, 0, gridSize * i, height);
	}

	fill(GRID_CLR);
	noStroke();
	ellipse(playerX * gridSize + gridSize / 2, playerY * gridSize + gridSize / 2, gridSize, gridSize);

	fill(COIN_CLR);
	noStroke();
	ellipse(coinX * gridSize + gridSize / 2, coinY * gridSize + gridSize / 2, gridSize, gridSize);
}

function keyPressed() {
	makeMove(keyCode);
}

function makeMove(code) {
  let move = brain.getMove(code);
  let originalDist = getDistance();
  
  switch (move) {
    case UP:
      playerY--;
      break;
    case RIGHT:
      playerX++;
      break;
    case DOWN:
      playerY++;
      break;
    case LEFT:
      playerX--;
      break;
    default:
      break;
  }
  
  playerX = max(0, min(NUM_CELLS-1, playerX));
  playerY = max(0, min(NUM_CELLS-1, playerY));
  
  let newDist = getDistance();
  
  if (newDist < originalDist) {
    brain.reward(code);
  } else {
    brain.punish(code);
  }
  
  if (playerX == coinX && playerY == coinY) {
    score++;
    scoreNode.html(score);
    placeCoin();
  }

  statsNode.remove();
  statsNode = brain.toHTML();
  statsNode.parent('stats-container');
}

function placeCoin() {
	do {
		coinX = floor(random(0, NUM_CELLS));
		coinY = floor(random(0, NUM_CELLS));
	} while (playerX == coinX && playerY == coinY);
}

function getDistance() {
  let xDist = abs(playerX - coinX);
  let yDist = abs(playerY - coinY);
  return xDist + yDist;
}

class Brain {
	constructor() {
		this.probs = {};
		this.lastMove = 0;
	}
	
	getMove(code) {
		if (!this.probs.hasOwnProperty(code)) {
			this.probs[code] = new SampleMap(DIRS.length);
		}
		
		let sampleIndex = this.probs[code].sample();
		this.lastMove = sampleIndex;
		
		return DIRS[sampleIndex];
	}
	
	reward(code) {
		this.probs[code].reward(this.lastMove);
	}
	
	punish(code) {
		this.probs[code].punish(this.lastMove);
	}

  toHTML() {
    let container = createDiv();

    for (let [key, probs] of Object.entries(this.probs)) {
      let probGroup = createDiv();
      probGroup.parent(container);

      let titleNode = createElement('label', `Key code: ${key}`);
      titleNode.parent(probGroup);

      let table = probs.toHTML();
      table.parent(probGroup);
    }

    if (!showStats) {
      container.addClass('hidden');
    }

    return container;
  }
}
class SampleMap {
	constructor(numOptions) {
		this.probs = [];
		
		for (let i = 0; i < numOptions; i++) {
			this.probs.push(20);
		}
	}
	
	sample() {
		let val = floor(random(0, this.total()));
		let i;
		
		for (i = 0; i < this.probs.length; i++) {
			let prob = this.probs[i];
			if (val < prob) {
				break;
			}
			val -= prob;
		}
		
		return i;
	}
	
	reward(idx) {
		this.probs[idx]++;
	}
	
	punish(idx) {
		if (this.probs[idx] > 1) {
			this.probs[idx]--;
		}
	}
	
	total() {
		return this.probs.reduce((m, v) => m + v);
	}

  toHTML() {
    let table = createElement('table');

    let arrowRow = createElement('tr');
    arrowRow.parent(table);
    DIR_STRINGS.forEach(str => {
      let cell = createElement('th', str);
      cell.parent(arrowRow);
    });

    let probRow = createElement('tr');
    probRow.parent(table);
    this.probs.forEach(count => {
      let prob = (count / this.total() * 100).toFixed(2);
      let cell = createElement('td', `${prob}%`);
      cell.parent(probRow);
    });

    return table;
  }
}
