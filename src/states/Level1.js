/*
 * Level 1 (spring)
 * Draws map, adds controls and interface
*/
import Simulator from 'objects/Simulator';
import Map from 'objects/Map';
import Owner from 'objects/Owner';
import Gui from 'objects/Gui';

class Level1 extends Phaser.State {
  create() {
    console.log('Starting first level...');
    this.map = new Map(this.game);

    // add level music
    Simulator.music = this.game.add.audio('background_music');
    Simulator.music.loopFull(1.5);

    Owner.init();
    Gui.init();
  }

  update() {
    // update camera
    this.updateCamera();

    //update interface
    Gui.updateInterface();
  }

  updateCamera() {
    // control camera by dragging the map
    if (this.game.input.activePointer.isDown) {
      if (this.game.draggingPoint) {
        // drag the camera by the amount the pointer has moved since last update
        this.game.camera.x += this.game.draggingPoint.x - this.game.input.activePointer.position.x;
      }
      // set new drag origin to current position
      this.game.draggingPoint = this.game.input.activePointer.position.clone();
    } else {
      this.game.draggingPoint = null;
    }
  }
}

export default Level1;
