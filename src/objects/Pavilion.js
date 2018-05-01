/*
 * Pavilion Class
 * Cages container
*/
import Prefab from 'objects/Prefab';
import Cage from 'objects/Cage';

class Pavilion extends Prefab {
  constructor(game, x, y, image, frame, group) {
    super(game, x, y, image, frame, group);
    this.game = game;

    this.cages = [];
    this.fullCages = [];
    this.sickCages = [];

    this.front = null;
    this.roof = null;

    this.timer = {
        clock: null,
        event: null,
        loops: []
    };

    this.state = {
        crowded: false,
        epidemic: false
    };

    Pavilion.count ++;
    Pavilion.all.push(this);
    this.id = Pavilion.count;
  }

  init() {
    // add object to game
    this.game.add.existing(this);
  }

  updateState() {
    // update pavilion crowded state
    this.updateFullCages();

    //update pavilion epidemic state
    this.updateSickCages();
  }

  updateFullCages() {
    if(this.fullCages.length > 2) {
      this.state.crowded = true;
      Pavilion.crowded.push(this);
    } else {
      this.state.crowded = false;
      Pavilion.crowded.splice(Pavilion.crowded.indexOf(this), 1);
    }
  }

  updateSickCages() {
    if(this.sickCages.length > 2) {
      this.state.epidemic = true;
      Pavilion.epidemic.push(this);
    } else {
      this.state.epidemic = false;
      Pavilion.epidemic.splice(Pavilion.epidemic.indexOf(this), 1);
    }
  }
}

Pavilion.all = [];
Pavilion.count = 0;
Pavilion.crowded = [];
Pavilion.epidemic = [];

export default Pavilion;
