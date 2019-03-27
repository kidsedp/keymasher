var statsNode;
var scoreNode;
var showStats = false;

function initDOM() {
  statsNode = document.getElementById('key-stats');
  scoreNode = document.getElementById('score');
  let statsButton = document.getElementById('show-stats-button');

  scoreNode.innerHTML = 0;

  statsButton.addEventListener('click', () => {
    if (showStats) {
      statsButton.innerHTML = 'Show stats';
    } else {
      statsButton.innerHTML = 'Hide stats';
    }
    showStats = !showStats;
    statsNode.classList.toggle('hidden');
  });
}

function updateStats() {
  emptyNode(statsNode);
  statsNode.appendChild(brain.toHTML());
}

function updateScore(newScore) {
  scoreNode.innerHTML = newScore;
}

function emptyNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
