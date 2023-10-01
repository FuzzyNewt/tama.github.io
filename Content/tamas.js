window.TamaTypes = {
  normal: "normal",
  earth: "earth",
  fire: "fire",
  water: "water",
}

window.Tamas = {
  "t001": {
    name: "Jitama",
    description: "Earth Tama: Body / Mind",
    type: TamaTypes.earth,
    //src: "",
    sprite_front: "images/characters/tamas/t001_f_n.png",
    sprite_back: "images/characters/tamas/t001_b_n.png",
    icon: "images/characters/tamas/t001_i.png",
    actions: [ "damage2", "regenStatus", "clumsyStatus" ],
  },
  "t002": {
    name: "Hitama",
    description: "Fire Tama: Body / Spirit",
    type: TamaTypes.fire,
    //src: "",
    sprite_front: "images/characters/tamas/t002_f_n.png",
    sprite_back: "images/characters/tamas/t002_b_n.png",
    icon: "images/characters/tamas/t002_i.png",
    actions: [ "damage1", "clumsyStatus" ],
  },
  "t003": {
    name: "Mitama",
    description: "Water Tama: Mind / Spirit",
    type: TamaTypes.water,
    //src: "",
    //sprite_front: "images/characters/tamas/t003_f_n.png",
    //sprite_back: "images/characters/tamas/t003_b_n.png",
    // Shiny
    sprite_front: "images/characters/tamas/t003_f_s.png",
    sprite_back: "images/characters/tamas/t003_b_s.png",
    icon: "images/characters/tamas/t003_i.png",
    actions: [ "damage1", "regenStatus" ],
  },
}
