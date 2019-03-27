const DIR_STRINGS = ['Left', 'Up', 'Right', 'Down'];

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
    let container = document.createElement('div');

    for (let [key, probs] of Object.entries(this.probs)) {
      let probGroup = document.createElement('div');
      container.appendChild(probGroup);

      let titleNode = document.createElement('label');
      titleNode.innerHTML = `Key code: ${key}`;
      probGroup.appendChild(titleNode);

      let table = probs.toHTML();
      probGroup.appendChild(table);
    }

    if (!showStats) {
      container.classList.add('hidden');
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
    let table = document.createElement('table');
    let keyRow = document.createElement('tr');
    let valRow = document.createElement('tr');

    DIR_STRINGS.forEach((string, i) => {
      let key = document.createElement('th');
      key.innerHTML = string;
      keyRow.appendChild(key);

      let val = document.createElement('td');
      let count = this.probs[i];
      let prob = (count / this.total() * 100).toFixed(2);
      val.innerHTML = prob;
      valRow.appendChild(val);
    });

    table.appendChild(keyRow);
    table.appendChild(valRow);

    return table;
  }
}
