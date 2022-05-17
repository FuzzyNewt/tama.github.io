class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;

  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(7) - cameraPerson.x,
      utils.withGrid(4.5) - cameraPerson.y
    )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(7) - cameraPerson.x,
      utils.withGrid(4.5) - cameraPerson.y
    )
  }

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // Return to Object Behaviors
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))

  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "images/maps/hero_home_1f-lower.png",
    upperSrc: "images/maps/hero_home_1f-upper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(4),
        y: utils.withGrid(6),
      }),
      npcA: new Person({
        x: utils.withGrid(6),
        y: utils.withGrid(9),
        src: "images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 1600 },
          { type: "stand", direction: "up", time: 2400 },
          { type: "stand", direction: "right", time: 3200 },
          { type: "stand", direction: "down", time: 4000 },
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(7),
        src: "images/characters/people/oak.png",
        behaviorLoop: [
          { type: "walk", direction: "down" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "down", time: 800 },
          { type: "stand", direction: "right", time: 1400 },
          { type: "stand", direction: "up", time: 2000 },
          { type: "stand", direction: "left", time: 2600 },
        ]
      })
    },
    walls: {
      //"16,16": true
      [utils.asGridCoord(0,1)] : true, // Left Walls
      [utils.asGridCoord(0,2)] : true,
      [utils.asGridCoord(0,3)] : true,
      [utils.asGridCoord(0,4)] : true,
      [utils.asGridCoord(0,5)] : true,
      [utils.asGridCoord(0,6)] : true,
      [utils.asGridCoord(0,7)] : true,
      [utils.asGridCoord(0,8)] : true,
      [utils.asGridCoord(0,9)] : true,
      [utils.asGridCoord(13,1)] : true, // Right Wall
      [utils.asGridCoord(13,2)] : true,
      [utils.asGridCoord(13,3)] : true,
      [utils.asGridCoord(13,4)] : true,
      [utils.asGridCoord(13,5)] : true,
      [utils.asGridCoord(13,6)] : true,
      [utils.asGridCoord(13,7)] : true,
      [utils.asGridCoord(13,8)] : true,
      [utils.asGridCoord(13,9)] : true,
      [utils.asGridCoord(1,2)] : true, // Top Wall
      [utils.asGridCoord(2,2)] : true,
      [utils.asGridCoord(3,2)] : true,
      [utils.asGridCoord(4,2)] : true,
      [utils.asGridCoord(5,2)] : true,
      [utils.asGridCoord(6,2)] : true,
      [utils.asGridCoord(7,2)] : true,
      [utils.asGridCoord(8,2)] : true,
      [utils.asGridCoord(9,2)] : true,
      [utils.asGridCoord(10,2)] : true,
      [utils.asGridCoord(11,2)] : true,
      [utils.asGridCoord(12,2)] : true,
      [utils.asGridCoord(1,10)] : true, // Bottom Wall
      [utils.asGridCoord(2,10)] : true,
      [utils.asGridCoord(3,10)] : true,
      [utils.asGridCoord(4,10)] : true,
      [utils.asGridCoord(5,10)] : true,
      [utils.asGridCoord(6,10)] : true,
      [utils.asGridCoord(7,10)] : true,
      [utils.asGridCoord(8,10)] : true,
      [utils.asGridCoord(9,10)] : true,
      [utils.asGridCoord(10,10)] : true,
      [utils.asGridCoord(11,10)] : true,
      [utils.asGridCoord(12,10)] : true,
      [utils.asGridCoord(12,3)] : true, // Stairs
      [utils.asGridCoord(11,4)] : true,
      [utils.asGridCoord(12,4)] : true,
      [utils.asGridCoord(6,5)] : true, // Table
      [utils.asGridCoord(6,6)] : true,
      [utils.asGridCoord(7,5)] : true,
      [utils.asGridCoord(7,6)] : true,
      [utils.asGridCoord(1,8)] : true, // Plants
      [utils.asGridCoord(12,8)] : true,
    }
  },
  Kitchen: {
    lowerSrc: "images/maps/KitchenLower.png",
    upperSrc: "images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(5),
      }),
      npcA: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(6),
        src: "images/characters/people/npc2.png"
      }),
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: "images/characters/people/npc3.png"
      })
    }
  },
}
