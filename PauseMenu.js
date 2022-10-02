class PauseMenu {
  constructor({progress, onComplete}) {
    this.progress = progress;
    this.onComplete = onComplete;
  }

  getOptions(pageKey) {

    //Case 1: Show the first page of options
    if (pageKey === "root") {
      const lineupTamas = playerState.lineup.map(id => {
        const {tamaId} = playerState.tamas[id];
        const base = Tamas[tamaId];
        return {
          label: base.name,
          description: base.description,
          handler: () => {
            this.keyboardMenu.setOptions( this.getOptions(id) )
          }
        }
      })
      return [
        ...lineupTamas,
        {
          label: "Save",
          description: "Save your progress",
          handler: () => {
            this.progress.save();
            this.close();
          }
        },
        {
          label: "Close",
          description: "Close the pause menu",
          handler: () => {
            this.close();
          }
        }
      ]
    }

    //Case 2: Show the options for just one tama (by id)
    const unequipped = Object.keys(playerState.tamas).filter(id => {
      return playerState.lineup.indexOf(id) === -1;
    }).map(id => {
      const {tamaId} = playerState.tamas[id];
      const base = Tamas[tamaId];
      return {
        label: `Swap for ${base.name}`,
        description: base.description,
        handler: () => {
          playerState.swapLineup(pageKey, id);
          this.keyboardMenu.setOptions( this.getOptions("root") );
        }
      }
    })

    return [
      ...unequipped,
      {
        label: "Move to front",
        description: "Move this tama to the front of the list",
        handler: () => {
          playerState.moveToFront(pageKey);
          this.keyboardMenu.setOptions( this.getOptions("root") );
        }
      },
      {
        label: "Back",
        description: "Back to root menu",
        handler: () => {
          this.keyboardMenu.setOptions( this.getOptions("root") );
        }
      }
    ];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("PauseMenu");
    this.element.classList.add("overlayMenu");
    this.element.innerHTML = (`
      <h2>Pause Menu</h2>
    `)
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  async init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container
    })
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions("root"));

    container.appendChild(this.element);

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })
  }

}