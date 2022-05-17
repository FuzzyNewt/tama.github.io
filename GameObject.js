class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "images/characters/people/hero.png",
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

  }

  mount(map) {
    console.log("Mounting!");
    this.isMounted = true;
    map.addWall(this.x, this.y);
    // Short Delay if the game object has behaviors - global cutscene first
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10)
  }

  update() {
  }

  async doBehaviorEvent(map) {

    // If a cut scene is play, or there is no behavior set, don't do anything.
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
      return;
    }

    // Set up event with relevant information
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    // Create an event instance out of our next event config.
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    // Set Next Event, Reset if End Reached to Repeat
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    // Do it again
    this.doBehaviorEvent(map);

  }

}
