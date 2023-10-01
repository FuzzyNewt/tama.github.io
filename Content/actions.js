window.Actions = {
  damage1: {
    name: "Tackle",
    description: "Pillowy punch of dough",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10}
    ]
  },
  damage2: {
    name: "WonkSlam",
    description: "My man's an elephant from Animal Crossing",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 30}
    ]
  },
  regenStatus: {
    name: "Regenerate",
    description: "Begin Healing",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "stateChange", status: { type: "regen", expiresIn: 3 } }
    ]
  },
  clumsyStatus: {
    name: "Splash",
    description: "Slippery water",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "clumsy", expiresIn: 3 } },
      { type: "textMessage", text: "{TARGET} is slipping all around!"},
    ]
  },
  //Items

  item_recoverHp: {
    name: "Potion",
    targetType: "friendly",
    success: [
      { type:"textMessage", text: "{CASTER} drinks a {ACTION}!", },
      { type:"stateChange", recover: 10, },
      { type:"textMessage", text: "{CASTER} recovers HP!", },
    ]
  },
  item_recoverHp: {
    name: "Super Potion",
    targetType: "friendly",
    success: [
      { type:"textMessage", text: "{CASTER} drinks a {ACTION}!", },
      { type:"stateChange", recover: 30, },
      { type:"textMessage", text: "{CASTER} recovers HP!", },
    ]
  },
  item_recoverStatus: {
    name: "Antidote",
    description: "Removes a status effect ",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses an {ACTION}!"},
      { type: "stateChange", status: null },
      { type: "textMessage", text: "Status Effects Removed", },
    ]
  },


}
