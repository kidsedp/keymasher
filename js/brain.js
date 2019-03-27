/**
 * brain.js
 *
 * Responsible for all reinforcement learning logic.
 */

const DIR_STRINGS = ['Left', 'Up', 'Right', 'Down'];

/**
 * Interface into reinforcement learning; moves can be sampled with
 * getMove(code), and the result can be rewarded or punished with
 * reward(code) or punish(code).
 */
class Brain {
	constructor() {
		this.probs = {};
		this.lastMove = 0;
	}
	
  /**
   * Gets a move from the brain based on a key code
   *
   * @param code  A key code integer
   * @return  An integer corresponding to UP, DOWN, LEFT, or RIGHT
   */
	getMove(code) {
		if (!this.probs.hasOwnProperty(code)) {
			this.probs[code] = new SampleMap(DIRS.length);
		}
		
		let sampleIndex = this.probs[code].sample();
		this.lastMove = sampleIndex;
		
		return DIRS[sampleIndex];
	}
	
  /**
   * Rewards the last move made with the provided code, making it more likely
   * to appear in the future.
   *
   * @param code  The key code that was provided
   */
	reward(code) {
		this.probs[code].reward(this.lastMove);
	}
	
  /**
   * Punishes the last move made with the provided code, making it less likely
   * to appear in the future.
   *
   * @param code  The key code that was provided
   */
	punish(code) {
		this.probs[code].punish(this.lastMove);
	}

  /**
   * Converts the brain's stats to an HTML element
   */
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

    return container;
  }
}

/**
 * Represents a mapping of direction possibilities for a single key
 */
class SampleMap {

  /**
   * Initializes the object
   *
   * @param numOptions  The number of possibilities for this mapping
   */
	constructor(numOptions) {
		this.probs = [];
		
		for (let i = 0; i < numOptions; i++) {
			this.probs.push(20);
		}
	}
	
  /**
   * Samples a possibility from the mapping
   */
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
	
  /**
   * Rewards the possibility at index `idx`, making it more likely
   *
   * @param idx  The index of the possibility to reward
   */
	reward(idx) {
		this.probs[idx]++;
	}
	
  /**
   * Punishes the possibility at index `idx`, making it less likely
   *
   * @param idx  The index of the possibility to punish
   */
	punish(idx) {
		if (this.probs[idx] > 1) {
			this.probs[idx]--;
		}
	}
	
  /**
   * Gets the total number of points in this mapping
   */
	total() {
		return this.probs.reduce((m, v) => m + v);
	}

  /**
   * Converts the mapping's stats to an HTML element
   */
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
