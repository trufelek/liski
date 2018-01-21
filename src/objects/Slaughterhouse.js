/*
 * Slaughterhouse Class
 * Slaughterhouse properties and methods
*/
import Prefab from 'objects/Prefab';
import Farm from 'objects/Farm';

class Slaughterhouse extends Prefab {
    constructor(game, x, y, image, frame, group) {
        super(game, x, y, image, frame, group);

        this.game = game;

        this.hidden = false;
	    this.stations = [];

	    this.timer = {
	        clock: null,
	        event: null,
	        loops: []
	    };

	    this.init();
    }

    init() {
	    // add object to game
	    this.game.add.existing(this);

	    // add killing stations
	    for(var k in Farm.killingStations) {
	        if(Farm.killingStations.hasOwnProperty(k)) {
	            this.stations.push(Farm.killingStations[k]);
	        }
	    }

	    // add skinning stations
	    for(var s in Farm.skinningStations) {
	        if(Farm.skinningStations.hasOwnProperty(s)) {
	            this.stations.push(Farm.skinningStations[s]);
	        }
	    }

	    // create timer loop
	    this.createTimerLoop(250, this.updateSlaughterhouse, this);
	}

	updateSlaughterhouse() {
	    if (this.game.input.activePointer.isDown) {
	        if(this.game.camera.x > 600) {
	            this.hideSlaughterhouse();
	        } else {
	            this.showSlaughterhouse();
	        }
	    }
	}

	showSlaughterhouse() {
	    this.game.add.tween(this).to({alpha: 1}, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
	    this.hidden = false;

	    this.hideChildrenStats();
	}

	hideSlaughterhouse() {
	    // hide on hover
	    this.game.add.tween(this).to({alpha: 0}, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
	    this.hidden = true;

	    this.showChildrenStats();
	}

	showChildrenStats() {
	    this.stations.forEach(function(e, i){
	        this.game.add.tween(e.statsBar.timerBar).to( { alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
	        this.game.add.tween(e.statsBar.attrsBar).to( { alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
	        e.input.priorityID = 1;
	        e.sound.volume = 1;
	    }, this);
	}

	hideChildrenStats() {
	    this.stations.forEach(function(e, i){
	        this.game.add.tween(e.statsBar.timerBar).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
	        this.game.add.tween(e.statsBar.attrsBar).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
	        e.input.priorityID = 0;
	        e.sound.volume = 0.3;
	    }, this);
	}
}

export default Slaughterhouse;