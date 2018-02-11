/*
 * Level
 * Level object, draws map, adds controls and interface
*/
import Simulator from 'objects/Simulator';
import Farm from 'objects/Farm';
import Map from 'objects/Map';
import Owner from 'objects/Owner';
import Gui from 'objects/Gui';
import Events from 'objects/Events';

class Level extends Phaser.State {
  create() {
    console.log('Starting first level...');
    // init game objects
    Map.init();
    Owner.init();
    Gui.init();
    //Events.init();

    // add level music
    Simulator.music = this.game.add.audio('wiosna');
    Simulator.music.loopFull(1.5);

    this.showLevelIntro();
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

  showLevelIntro() {
    var titleStyles = {
      font: 'bold 60px Arial',
      fill: '#FFFFFF',
      align: 'center'
    };

    var textStyles = {
      font: 'bold 21px Arial',
      fill: '#FFFFFF',
      align: 'left'
    };

    var intro = this.game.add.graphics(0,0);
    intro.beginFill(0x000000, 1);
    intro.drawRect(0, 0, this.game.width, this.game.height);
    intro.endFill();
    intro.inputEnabled = true;
    intro.input.priorityID = 4;
    intro.fixedToCamera = true;

    var title = intro.addChild(this.game.add.text(this.game.width / 2, this.game.height / 2, this.game.season.toUpperCase(), titleStyles));
    title.anchor.setTo(0.5);

    var title = intro.addChild(this.game.add.text(this.game.width / 2, this.game.height / 2 + 75, "Zabito zwierząt: " + Farm.killed, textStyles));
    title.anchor.setTo(0.5);

    game.time.events.add(3000, function() {
      intro.destroy();
    }, this);
  }

  switchSeasons() {
    var currentSeason = this.game.seasons.indexOf(this.game.season);
    var newSeason = currentSeason == 3 ? this.game.seasons[0] : this.game.seasons[currentSeason + 1];
    this.game.season = newSeason;

    Simulator.music.stop();
    Simulator.music = this.game.add.audio(this.game.season);
    Simulator.music.loopFull(1.5);

    Map.switchTextures(this.game.season);

    this.showLevelIntro();
  }
}

export default Level;