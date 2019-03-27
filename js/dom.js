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
  statsNode.remove();
  statsNode = brain.toHTML();
  statsNode.parent('stats-container');
}

function updateScore(newScore) {
  scoreNode.html(newScore);
}

function generateElement(data) {
  fns = {table: createTable};

  if (!fns.hasOwnProperty(data.tag)) {
    throw new Error(`No generation method for ${data.tag}.`);
  }

  return fns[data.tag](data.value);
}

function createTable(data) {
  let table = createElement('table');
  let keyRow = createElement('tr');
  let valRow = createElement('tr');
  keyRow.parent(table);
  valRow.parent(table);

  for (let [k, v] of Object.entries(data)) {
    let keyCell = createElement('th', k);
    let valCell = createElement('td', v);
    keyCell.parent(keyRow);
    valCell.parent(valRow);
  }

  return table;
}
