/**
 * entity.js
 *
 * Defines entities that exist on the grid
 */

class Entity {

  /**
   * Initializes the entity
   *
   * @param avatar  The image to display
   */
  constructor(avatar) {
    this.avatar = avatar;
    this.x = 0;
    this.y = 0;
  }

  /**
   * Sets the entity to a random position
   */
  randomizePosition() {
    this.x = floor(random(0, NUM_CELLS));
    this.y = floor(random(0, NUM_CELLS));
  }

  /**
   * Gets the Manhattan distance from another entity
   */
  distanceFrom(other) {
    return abs(this.x - other.x) + abs(this.y - other.y);
  }

  /**
   * Checks if this entity is at the same position as another entity
   */
  samePositionAs(other) {
    return this.x == other.x && this.y == other.y;
  }

  /**
   * Draws the entity on the canvas
   */
  show() {
    push();
    scale(width/NUM_CELLS);
    image(this.avatar, this.x, this.y, 1, 1);
    pop();
  }

  /**
   * Moves the entity
   *
   * @param x  The direction in the x direction to move (positive for right,
   *           negative for left)
   * @param y  The direction in the y direction to move (positive for down,
   *           negative for up)
   */
  move(x, y) {
    this.x += x;
    this.y += y;

    this.x = max(0, min(NUM_CELLS-1, this.x));
    this.y = max(0, min(NUM_CELLS-1, this.y));
  }
}
