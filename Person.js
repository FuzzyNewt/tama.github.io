class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;

    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", 1]
    }
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {

      // More cases for starting to walk will go here

      // Case: keyboard ready and have an arrow pressed
      if (this.isPlayerControlled && state.arrow) {
        //
        console.log("Your Current Position is: "+this.x+","+this.y);
        console.log("Your Direction is: "+this.direction);
        console.log("Your Destination is: ");
        console.log(utils.nextPosition(this.x, this.y, this.direction));
        console.log("Is there a wall for this? ");
        //console.log(utils.nextPosition(this.x, this.y, this.direction));

        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow
        })
      }
      this.updateSprite(state);
    }
  }

  startBehavior(state, behavior) {
    // Set Character Direction to what behavior has
    this.direction = behavior.direction;
    if (behavior.type === "walk") {
      // console.log(state.map.isSpaceTaken(this.x, this.x, this.direction)); True / False if the space is taken // collision, walls
      // Stop if space not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        return;
      }
      // Ready to walk
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
    }
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -=1;
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-"+this.direction);
      return;
    }
    this.sprite.setAnimation("idle-"+this.direction);
  }

}
