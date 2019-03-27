class Entity {
  constructor(clr) {
    this.clr = clr;
    this.x = 0;
    this.y = 0;
  }

  randomizePosition() {
    this.x = floor(random(0, NUM_CELLS));
    this.y = floor(random(0, NUM_CELLS));
  }

  distanceFrom(other) {
    return abs(this.x - other.x) + abs(this.y - other.y);
  }

  samePositionAs(other) {
    return this.x == other.x && this.y == other.y;
  }

  show() {
    fill(this.clr);
    noStroke();
    push();
    scale(width/NUM_CELLS);
    ellipse(this.x+0.5, this.y+0.5, 1, 1);
    pop();
  }

  move(x, y) {
    this.x += x;
    this.y += y;

    this.x = max(0, min(NUM_CELLS-1, this.x));
    this.y = max(0, min(NUM_CELLS-1, this.y));
  }
}

