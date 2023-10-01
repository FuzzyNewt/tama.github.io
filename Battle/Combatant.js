class Combatant {
  constructor(config, battle) {
    Object.keys(config).forEach(key => {
      this[key] = config[key];
    })
    this.hp = typeof(this.hp) === "undefined" ? this.maxHp : this.hp;
    this.battle = battle;
  }

  get hpPercent() {
    const percent = this.hp / this.maxHp * 100;
    return percent > 0 ? percent : 0;
  }

  get xpPercent() {
    return this.xp / this.maxXp * 100;
  }

  get isActive() {
    return this.battle?.activeCombatants[this.team] === this.id;
  }

  get givesXp() {
    return this.level * 3; // TODO: This is probably a very bad xp formula and may result in the scale being too hard to ever level up to level 100. Check back in on this. I wing-ed it...
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("Combatant");
    this.hudElement.setAttribute("data-combatant", this.id);
    this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.innerHTML = (`
      <p class="Combatant_name">${this.name}</p>
      <p class="Combatant_level"></p>
      <div class="Combatant_character_crop">
        <img class="Combatant_character" alt="${this.name}" src="${this.src}" />
      </div>
      <img class="Combatant_type" src="${this.icon}" alt="${this.type}" />
      <svg viewBox="0 0 48 3" class="Combatant_life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
        <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
      </svg>
      <svg viewBox="0 0 64 2" class="Combatant_xp-container">
        <rect x=0 y=0 width="0%" height=1 fill="#40c8f8" />
        <rect x=0 y=1 width="0%" height=1 fill="#40c8f8" />
      </svg>
      <p class="Combatant_status"></p>
    `);

    this.tamaElement = document.createElement("img");
    this.tamaElement.classList.add("Tama");
    this.tamaElement.setAttribute("src", this.src );
    if (this.team=='player') {
      this.tamaElement.setAttribute("src", this.sprite_back);
    } else {
      this.tamaElement.setAttribute("src", this.sprite_front);
    }
    // this.tamaElement.setAttribute("sprite_front", this.sprite_front );
    // this.tamaElement.setAttribute("sprite_back", this.sprite_back );
    this.tamaElement.setAttribute("alt", this.name );
    this.tamaElement.setAttribute("data-team", this.team );

    this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
    this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");
  }

  update(changes={}) {
    //Update anything incoming
    Object.keys(changes).forEach(key => {
      this[key] = changes[key]
    });

    //Update active flag to show the correct tama & hud
    this.hudElement.setAttribute("data-active", this.isActive);
    this.tamaElement.setAttribute("data-active", this.isActive);

    //Update HP & XP percent fills
    this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`)
    this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`)

    //Update level on screen
    this.hudElement.querySelector(".Combatant_level").innerText = 'Lv '+this.level;

    //Update status
    const statusElement = this.hudElement.querySelector(".Combatant_status");
    if (this.status) {
      statusElement.innerText = this.status.type;
      statusElement.style.display = "block";
    } else {
      statusElement.innerText = "";
      statusElement.style.display = "none";
    }
  }

  getReplacedEvents(originalEvents) {

    if (this.status?.type === "clumsy" && utils.randomFromArray([true, false, false])) {
      return [
        { type: "textMessage", text: `${this.name} flops over!` },
      ]
    }

    return originalEvents;
  }

  getPostEvents() {
    if (this.status?.type === "regen") {
      return [
        { type: "textMessage", text: "Regeneration status added" },
        { type: "stateChange", recover: 5, onCaster: true }
      ]
    }
    return [];
  }

  decrementStatus() {
    if (this.status?.expiresIn > 0) {
      this.status.expiresIn -= 1;
      if (this.status.expiresIn === 0) {
        this.update({
          status: null
        })
        return {
          type: "textMessage",
          text: "Status expired!"
        }
      }
    }
    return null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.tamaElement);
    this.update();
  }

}
