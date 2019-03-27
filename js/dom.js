var statsNode;
var scoreNode;
var showStats = false;

function initDOM() {
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

function updateStats() {
  emptyNode(statsNode.elt);
  statsNode.elt.appendChild(brain.toHTML());
}

function updateScore(newScore) {
  scoreNode.html(newScore);
}

function emptyNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
