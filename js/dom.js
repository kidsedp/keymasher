/**
 * dom.js
 *
 * Handles interaction between the game and the DOM elements outside the canvas
 */

/**
 * The node where the brain stats are contained
 */
var statsNode;

/**
 * The node containing the game score
 */
var scoreNode;

/**
 * Whether the stats should be shown or not
 */
var showStats = false;

/**
 * Retrieving the DOM elements of interest and initializes them if necessary.
 *
 * @param brain  The brain object to load preset stats from, if available
 * @param score  The initial score
 */
function initDOM(brain, score) {
  statsNode = document.getElementById('key-stats');
  scoreNode = document.getElementById('score');

  document.getElementById('show-stats-button').addEventListener('click', toggleStats);
  document.getElementById('reset-game-button').addEventListener('click', resetGame);

  updateStats(brain);
  updateScore(score);
}

/**
 * Toggles the brain stats in and out of view
 */
function toggleStats() {
  if (showStats) {
    this.innerHTML = 'Show stats';
  } else {
    this.innerHTML = 'Hide stats';
  }
  showStats = !showStats;
  statsNode.classList.toggle('hidden');
}

/**
 * Replaces the stats with the current brain stats
 *
 * @param brain  The brain object to get the stats from
 */
function updateStats(brain) {
  emptyNode(statsNode);
  statsNode.appendChild(brain.toHTML());
}

/**
 * Updates the score on the page
 *
 * @param newScore  The score to display
 */
function updateScore(newScore) {
  localStorage.setItem('keymasher_score', newScore);
  scoreNode.innerHTML = newScore;
}

/**
 * Helper function for removing all children of a node
 *
 * @param node  The node to empty
 */
function emptyNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
