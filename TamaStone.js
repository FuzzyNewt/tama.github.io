class TamaStone extends GameObject {
  constructor(config) {
    super(config);
    this.sprite = new Sprite({
      gameObject: this,
      src: "images/characters/tama-stone.png",
      animations: {
        "used-down"   : [ [0,0] ],
        "unused-down" : [ [1,0] ],
      },
      currentAnimation: "used-down"
    });
    this.storyFlag = config.storyFlag;
    this.tamas = config.tamas;

    this.talking = [
      {
        required: [this.storyFlag],
        events: [
          { type: "textMessage", text: "You have already used this." },
        ]
      },
      {
        events: [
          { type: "textMessage", text: "Approaching the legendary tama stone..." },
          { type: "craftingMenu", tamas: this.tamas },
          { type: "addStoryFlag", flag: this.storyFlag },
        ]
      }
    ]

  }

  update() {
   this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
    ? "used-down"
    : "unused-down";
  }

}
