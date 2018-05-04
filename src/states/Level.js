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
import Tutorial from 'objects/Tutorial';

class Level extends Phaser.State {
  create() {
    console.log('Starting game...');
    this.conditions = this.game.seasonConditions[this.game.season];

    // init game objects
    Owner.init();
    Gui.init();
    Map.init();
    //Events.init();

    // create game interface
    Gui.createInterface();

    // add level music
    Simulator.music = this.game.add.audio('wiosna');
    Simulator.music.loopFull(0);

    // reset game tools mode on esc click
    this.game.input.keyboard.onUpCallback = function (e) {
      if(e.keyCode == Phaser.Keyboard.ESC) {
        if(this.game.toolsMode != 'default') {
          this.game.toolsMode = 'default';
          this.game.canvas.style.cursor = this.game.cursor.default;
          this.game.currentCursor = this.game.cursor.default;
        }
      }
    };

    this.showLevelIntro();
  }

  update() {
    //update interface
    Gui.updateInterface();

    //check next season condition
    if(this.conditions) {
      this.checkNextSeasonCondition();
    }
  }

  startTutorial() {
    this.tutorial = new Tutorial();
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

    var title = intro.addChild(this.game.add.text(this.game.width / 2, this.game.height / 2 + 75, "Zabitych zwierząt: " + Farm.killed, textStyles));
    title.anchor.setTo(0.5);

    game.time.events.add(3000, function() {
      intro.destroy();

      if(this.game.tutorialEnabled) {
        this.startTutorial();
      }
    }, this);
  }

  checkNextSeasonCondition() {
    // check if conditions for next level are true
    var condition = Object.keys(this.conditions).every(function(c){ return this.conditions[c] }, this);

    if(condition) {
      this.conditions = null;
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.switchSeasons, this);
    }
  }

  switchSeasons() {
    // switch game seasons
    var currentSeason = this.game.seasons.indexOf(this.game.season);
    var newSeason = currentSeason == 3 ? this.game.seasons[0] : this.game.seasons[currentSeason + 1];
    var seasonDuration = 	this.game.seasonDuration[newSeason];
    var seasonConditions = this.game.seasonConditions[newSeason]
    this.game.season = newSeason;

    // set year
    if(currentSeason == 3) {
      this.game.year ++;
    }

    // reset conditions
    for(var c in seasonConditions) {
      seasonConditions[c] = false;
    }

    this.conditions = seasonConditions;

    // season's timer
    if(!seasonConditions.timesUp) {
      this.game.time.events.add(Phaser.Timer.MINUTE * seasonDuration.minutes + Phaser.Timer.SECOND * seasonDuration.seconds, this.switchSeasons, this);
    }

    Simulator.music.stop();
    Simulator.music = this.game.add.audio(this.game.season.replace('ń', 'n'));
    Simulator.music.loopFull(0);

    this.showLevelIntro();
  }

}

export default Level;
