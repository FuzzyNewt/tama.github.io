class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}; // Live objects are in here
    this.configObjects = config.configObjects; // Configuration content


    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
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
    if (this.walls[`${x},${y}`]) {
      return true;
    }
    //Check for game objects at this position
    return Object.values(this.gameObjects).find(obj => {
      if (obj.x === x && obj.y === y) { return true; }
      if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y ) {
        return true;
      }
      return false;
    })

  }

  mountObjects() {
    Object.keys(this.configObjects).forEach(key => {

      let object = this.configObjects[key];
      object.id = key;

      let instance;
      if (object.type === "Person") {
        instance = new Person(object);
      }
      if (object.type === "TamaStone") {
        instance = new TamaStone(object);
      }
      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;
      instance.mount(this);
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        break;
      }
    }
    this.isCutscenePlaying = false;
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {

      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }
}

window.OverworldMaps = {
  home_2f: {
    id: "home_2f",
    lowerSrc: "images/maps/hero_home_2f-lower.png",
    upperSrc: "images/maps/hero_home_2f-upper.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(2),
        y: utils.withGrid(6),
      },
      test_a: {
        type: "Person",
        x: utils.withGrid(2),
        y: utils.withGrid(3),
        src: "images/characters/people/officer.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 400, },
          { type: "stand", direction: "down", time: 800, },
          { type: "stand", direction: "right", time: 1200, },
          { type: "stand", direction: "up", time: 1600, },
          { type: "stand", direction: "left", time: 2000, },
          { type: "stand", direction: "down", time: 2400, },
          { type: "stand", direction: "right", time: 2800, },
          { type: "stand", direction: "up", time: 3200, },
        ],
        talking: [
          {
            required: ["TALKED_TO_TEST_A"],
            events: [
              { type: "textMessage", text: "You can speak with Test B, now.", faceHero: "test_a" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "My name is Test A.", faceHero: "test_a" },
              { type: "textMessage", text: "I stand in different directions. This is rotating.", faceHero: "test_a" },
              { type: "addStoryFlag", flag: "TALKED_TO_TEST_A"},
            ]
          }
        ]
      },
      test_b: {
        type: "Person",
        x: utils.withGrid(4),
        y: utils.withGrid(3),
        src: "images/characters/people/officer.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 400, },
          { type: "stand", direction: "down", time: 800, },
          { type: "stand", direction: "right", time: 1200, },
          { type: "stand", direction: "up", time: 1600, },
          { type: "walk", direction: "down", },
          { type: "walk", direction: "right", },
          { type: "walk", direction: "up", },
          { type: "walk", direction: "left", },
        ],
        talking: [
          {
            required: ["TALKED_TO_TEST_A"],
            events: [
              { type: "textMessage", text: "Great. You have spoken with Test A.", faceHero: "test_b" },
              { type: "textMessage", text: "I walk around in circles and rotate.", faceHero: "test_b" },
              { type: "textMessage", text: "Can you break my movement?", faceHero: "test_b" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "My name is Test B.", faceHero: "test_b" },
              { type: "textMessage", text: "Speak with Test A, first!", faceHero: "test_b" },
            ]
          }
        ]
      },
      test_c: {
        type: "Person",
        x: utils.withGrid(6),
        y: utils.withGrid(3),
        src: "images/characters/people/officer.png",
        behaviorLoop: [
          { type: "stand", direction: "down", time: 2400, },
          { type: "stand", direction: "left", time: 800, },
          { type: "stand", direction: "right", time: 800, },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "My name is Test C.", faceHero: "test_c" },
              { type: "textMessage", text: "My talking event includes movement.", faceHero: "test_c" },
              { type: "textMessage", text: "Because of this, my behavior loop can't include movement.", faceHero: "test_c" },
              { type: "textMessage", text: "Otherise things could get wonky.", faceHero: "test_c" },
              { who: "test_c", type: "walk",  direction: "left" },
              { who: "test_c", type: "walk",  direction: "right" },
              { who: "test_c", type: "walk",  direction: "right" },
              { who: "test_c", type: "walk",  direction: "left" },
              { who: "test_c", type: "stand",  direction: "down" },
              { type: "textMessage", text: "See?", faceHero: "test_c" },
            ]
          }
        ]
      },
      test_d: {
        type: "Person",
        x: utils.withGrid(11),
        y: utils.withGrid(6),
        src: "images/characters/people/officer.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 2400, },
          { type: "walk", direction: "left", },
          { type: "walk", direction: "down", },
          { type: "walk", direction: "right", },
          { type: "walk", direction: "up", },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "My name is Test D. Similar to Test C, I move in my event.", faceHero: "test_d" },
              { type: "textMessage", text: "But my behavior loop includes walking.", faceHero: "test_d" },
              { type: "textMessage", text: "Can you break my movement?", faceHero: "test_d" },
              { who: "test_d", type: "walk",  direction: "up" },
              { who: "test_d", type: "walk",  direction: "down" },
              { who: "test_d", type: "stand",  direction: "left" },
              { type: "textMessage", text: "See?", faceHero: "test_d" },
            ]
          }
        ]
      },
      nurse: {
        type: "Person",
        x: utils.withGrid(11),
        y: utils.withGrid(8),
        src: "images/characters/people/nurse.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 800, },
          { type: "stand", direction: "down", time: 1800, },
          { type: "stand", direction: "right", time: 800, },
          { type: "stand", direction: "up", time: 1800, },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "I'm nurse Joy.", faceHero: "nurse" },
              // { type: "addStoryFlag", flag: "TALKED_TO_NURSE"},
            ]
          }
        ]
      },
      rival: {
        type: "Person",
        x: utils.withGrid(11),
        y: utils.withGrid(9),
        src: "images/characters/people/rival.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 500, },
        ],
        talking: [
          {
            required: ["TALKED_TO_RIVAL"],
            events: [
              { type: "textMessage", text: "Let's Fight!", faceHero: "rival" },
              { type: "battle", enemyId: "rival", arena: "battle--town" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "I'm your rival. You'll face me soon.", faceHero: "rival" },
              { type: "addStoryFlag", flag: "TALKED_TO_RIVAL"},
            ]
          }
        ]
      },
      // tamaStone: {
      //   type: "TamaStone",
      //   x: utils.withGrid(2),
      //   y: utils.withGrid(7),
      //   storyFlag: "USED_PIZZA_STONE",
      //   tamas: ["v001", "f001"],
      // },
    },
    walls: function() {
      let walls = {};
      [ "0,1",   "0,2",   "0,3",   "0,4",   "0,5",   "0,6",   "0,7",   "0,8",   "0,9", // Left Wall
        "12,1",  "12,2",  "12,3",  "12,4",  "12,5",  "12,6",  "12,7",  "12,8",  "12,9",  // Left Wall
        "1,2",   "2,2",   "3,2",   "4,2",   "5,2",   "6,2",   "7,2",   "8,2",   "9,2",   "10,2",  "11,2",  // Top Wall
        "1,10",  "2,10",  "3,10",  "4,10",  "5,10",  "6,10",  "7,10",  "8,10",  "9,10",  "10,10", "11,10",  // Bottom Wall
        "8,3",   "8,4",   "9,4",  // Stairs
        "6,5",   "6,6", // TV
        "2,7",   // Bed
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(6,4)]: [
        {
          events: [
            { type: "textMessage", text:"Be careful! Don't trip over the wires back there!", },
          ]
        }
      ],
      [utils.asGridCoord(9,3)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "home_1f",
              x: utils.withGrid(10),
              y: utils.withGrid(3),
              direction: "left"
            }
          ]
        }
      ]
    }
  },
  home_1f: {
    id: "home_1f",
    lowerSrc: "images/maps/hero_home_1f-lower.png",
    upperSrc: "images/maps/hero_home_1f-upper.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      },
      mom: {
        type: "Person",
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: "images/characters/people/mom.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 800, },
        ],
        talking: [
          {
            required: ["TALKED_TO_MOM"],
            events: [
              { type: "textMessage", text: "Take great care of your Tama.", faceHero: "mom" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "...Right. All boys leave home someday.", faceHero: "mom" },
              { type: "textMessage", text: "It said so on TV.", faceHero: "mom" },
              { type: "textMessage", text: "Oh, yes. PROF. OAK, next door, was looking for you.", faceHero: "mom" },
              { type: "addStoryFlag", flag: "TALKED_TO_MOM"},
            ]
          }
        ]
      },
    },
    walls: function() {
      let walls = {};
      [ "0,1",   "0,2",   "0,3",   "0,4",   "0,5",   "0,6",   "0,7",   "0,8",   "0,9",   // Left Wall
        "13,1",  "13,2",  "13,3",  "13,4",  "13,5",  "13,6",  "13,7",  "13,8",  "13,9",  // Right Wall
        "1,2",   "2,2",   "3,2",   "4,2",   "5,2",   "6,2",   "7,2",   "8,2",   "9,2",   "10,2",  "11,2",  // Top Wall
        "1,10",  "2,10",  "3,10",  /*"4,10",*/ "4,11",  "5,10",  "6,10",  "7,10",  "8,10",  "9,10",  "10,10", "11,10", "12,10", // Bottom Wall
        "12,3",  "11,4",  "12,4",  // Stairs
        "6,5",   "6,6",   "7,5",   "7,6",   // Table
        "1,8",   "12,8",  // Plants
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(11,3)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "home_2f",
              x: utils.withGrid(10),
              y: utils.withGrid(3),
              direction: "right"
            }
          ]
        }
      ],
      [utils.asGridCoord(4,9)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "pallet_town",
              x: utils.withGrid(16),
              y: utils.withGrid(9),
              direction: "down"
            }
          ]
        }
      ]
    }
  },
  rival_1f: {
    id: "rival_1f",
    lowerSrc: "images/maps/rival_1f-lower.png",
    upperSrc: "images/maps/rival_1f-upper.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      },
    },
    walls: function() {
      let walls = {};
      [ "0,1",   "0,2",   "0,3",   "0,4",   "0,5",   "0,6",   "0,7",   "0,8",   "0,9",   // Left Wall
        "14,1",  "14,2",  "14,3",  "14,4",  "14,5",  "14,6",  "14,7",  "14,8",  "14,9",  // Right Wall
        "1,2",   "2,2",   "3,2",   "4,2",   "5,2",   "6,2",   "7,2",   "8,2",   "9,2",   "10,2",  "11,2",  "12,2",  "13,2",  // Top Wall
        "1,10",  "2,10",  "3,10",  "4,10",  "5,10",  "6,10",  "7,10",  "8,10",  "9,10",  "10,10", "11,10", "12,10", "13,2",  // Bottom Wall
        "7,5",   "7,6",   "8,5",   "8,6",   // Table
        "1,9",   "13,9",  // Plants
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(5,9)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "pallet_town",
              x: utils.withGrid(7),
              y: utils.withGrid(9),
              direction: "down"
            }
          ]
        }
      ]
    }
  },
  pallet_town: {
    id: "pallet_town",
    lowerSrc: "images/maps/pallet_town-lower.png",
    upperSrc: "images/maps/pallet_town-upper.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      },
      trainer_f: {
        type: "Person",
        x: utils.withGrid(8),
        y: utils.withGrid(9),
        src: "images/characters/people/trainer-f.png",
        behaviorLoop: [
          { type: "stand", direction: "down", time: 500, },
        ],
        talking: [
          {
            required: ["TALKED_TO_TRAINER_F"],
            events: [
              { type: "textMessage", text: "Did you want to battle?", faceHero: "trainer_f" },
              { type: "battle", enemyId: "trainer_f", arena: "battle--water" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "Oh hey!", faceHero: "trainer_f" },
              { type: "addStoryFlag", flag: "TALKED_TO_TRAINER_F"},
            ]
          }
        ]
      },
    },
    walls: function() {
      let walls = {};
      [ "2,1",   "2,2",   "2,3",   "2,4",   "2,5",   "2,6",   "2,7",   "2,8",   "2,9",   "2,10",  "2,11",  "2,12",  "2,13",  "2,14",  "2,15",  "2,16",  "2,17",  "2,18",  "2,19",  "2,20",  // Left Wall
        "23,1",  "23,2",  "23,3",  "23,4",  "23,5",  "23,6",  "23,7",  "23,8",  "23,9",  "23,10", "23,11", "23,12", "23,13", "23,14", "23,15", "23,16", "23,17", "23,18", "23,19", "23,20", // Right Wall
        "1,2",   "2,2",   "3,2",   "4,2",   "5,2",   "6,2",   "7,2",   "8,2",   "9,2",   "10,2",  "11,2",  "12,2",  "12,1",  "15,1",  "13,0",  "14,0",  "15,2",  "16,2",  "17,2",  "18,2",  "19,2",  "20,2",  "21,2",  "22,2", // Top Wall
        "1,20",  "2,20",  "3,20",  "4,20",  "5,20",  "6,20",  "7,20",  "8,20",  "9,20",  "10,20", "11,20", "12,20", "13,20", "14,20", "15,20", "16,20", "17,20", "18,20", "19,20", "20,20", "21,20", "22,20", // Bottom Wall
        "6,5",   "7,5",   "8,5",   "9,5",   "10,5", // Rival House
        "6,6",   "7,6",   "8,6",   "9,6",   "10,6",
        "6,7",   "7,7",   "8,7",   "9,7",   "10,7",
        "6,8",            "8,8",   "9,8",   "10,8",
        "15,5",  "16,5",  "17,5",  "18,5",  "19,5", // Hero House
        "15,6",  "16,6",  "17,6",  "18,6",  "19,6",
        "15,7",  "16,7",  "17,7",  "18,7",  "19,7",
        "15,8",           "17,8",  "18,8",  "19,8",
        "14,11", "15,11", "16,11", "17,11", "18,11", "19,11", "20,11", // Lab
        "14,12", "15,12", "16,12", "17,12", "18,12", "19,12", "20,12",
        "14,13", "15,13", "16,13", "17,13", "18,13", "19,13", "20,13",
        "14,14", "15,14", "16,14",          "18,14", "19,14", "20,14",
        "5,8",   "14,8",  // Mailboxes
        "6,12",  "7,12",  "8,12",  "9,12",  "10,12", // Fences
        "14,17", "15,17", "16,17", "17,17", "18,17", "19,17",
        "6,15", // Signs
        "8,18", "9,18", "10,18", "11,18", // Pond
        "8,19", "9,19", "10,19", "11,19",
        "8,20", "9,20", "10,20", "11,20",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(7,8)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "rival_1f",
              x: utils.withGrid(5),
              y: utils.withGrid(9),
              direction: "up"
            }
          ]
        }
      ],
      [utils.asGridCoord(16,8)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "home_1f",
              x: utils.withGrid(4),
              y: utils.withGrid(9),
              direction: "up"
            }
          ]
        }
      ],
      [utils.asGridCoord(17,14)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "lab",
              x: utils.withGrid(7),
              y: utils.withGrid(13),
              direction: "up"
            }
          ]
        }
      ]
    }
  },
  lab: {
    id: "lab",
    lowerSrc: "images/maps/lab-lower.png",
    upperSrc: "images/maps/lab-upper.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      },
      oak: {
        type: "Person",
        x: utils.withGrid(7),
        y: utils.withGrid(5),
        src: "images/characters/people/oak.png",
        behaviorLoop: [
          { type: "stand", direction: "down", time: 500, },
        ],
        talking: [
          {
            required: ["TALKED_TO_MOM"],
            events: [
              { type: "textMessage", text: "Be on your best behavior.", faceHero: "oak" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "I'm going to miss you.", faceHero: "oak" },
              { type: "addStoryFlag", flag: "TALKED_TO_MOM"},
            ]
          }
        ]
      },
    },
    walls: function() {
      let walls = {};
      [ "0,1",   "0,2",   "0,3",   "0,4",   "0,5",   "0,6",   "0,7",   "0,8",   "0,9",   "0,10",  "0,11",  "0,12",  "0,13",  // Left Wall
        "14,1",  "14,2",  "14,3",  "14,4",  "14,5",  "14,6",  "14,7",  "14,8",  "14,9",  "14,10", "14,11", "14,12", "14,13", // Right Wall
        "1,2",   "2,2",   "3,2",   "4,2",   "5,2",   "6,2",   "7,2",   "8,2",   "9,2",   "10,2",  "11,2",  "12,2",  "13,2",  // Top Wall
        "1,14",  "2,14",  "3,14",  "4,14",  "5,14",  "6,14",  "7,14",  "8,14",  "9,14",  "10,14", "11,14", "12,14", "13,14", // Bottom Wall
        "1,9",   "2,9",   "3,9",   "4,9",   "5,9",   // Shelves
        "9,9",   "10,9",  "11,9",  "12,9",  "13,9",  // Shelves
        "9,5",   "10,5",  "11,5",  // Table
        "1,4",   "1,5",   "2,5",   "3,5",   // Machines
        "2,6",   "3,6",
        "1,13",   "13,13", // Plants
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(7,13)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "pallet_town",
              x: utils.withGrid(17),
              y: utils.withGrid(15),
              direction: "down"
            }
          ]
        }
      ]
    }
  },
}
