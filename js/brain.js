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

  toObject() {
    let obj = {tag: 'div', children: []};

    for (let [key, probs] of Object.entries(this.probs)) {
      obj.children.push({tag: 'div', children: [
        {tag: 'label', value: `Key code: ${key}`},
        probs.toObject()
      ]});
    }
  }

  toHTML() {
    let container = createDiv();

    for (let [key, probs] of Object.entries(this.probs)) {
      let probGroup = createDiv();
      probGroup.parent(container);

      let titleNode = createElement('label', `Key code: ${key}`);
      titleNode.parent(probGroup);

      let table = generateElement(probs.toObject());
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

  toObject() {
    let obj = {tag: 'table', value: {}};

    DIR_STRINGS.forEach((str, i) => {
      let count = this.probs[i];
      let prob = (count / this.total() * 100).toFixed(2);
      obj.value[str] = prob;
    });

    return obj;
  }
}
