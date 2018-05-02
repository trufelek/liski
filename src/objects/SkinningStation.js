/*
 * SkinningStation Class
 * Skinning stations properties and methods
*/
import Prefab from 'objects/Prefab';
import Farm from 'objects/Farm';
import Stats from 'objects/Stats';

class SkinningStation extends Prefab {
    constructor(game, x, y, image, frame, group) {
      super(game, x, y, image, frame, group);

      this.game = game;

	    this.attributes = {
	        stack: {
	            max: 50,
	            min: 0,
	            current: 0,
	            label: 'Ilość zwierząt',
	            icon: 'kill_stock_icon',
	            increase: 25,
	            skinning: 2,
              level: 0,
              visible: true,
              position: 1
	        }
	    };

	    this.state = {
	        ready: true,
	        full: false
	    };

	    this.timer = {
	        clock: null,
	        event: null,
	        loops: [],
	        duration: { minutes: 0, seconds: 1 },
	        progress: 0
	    };

	    this.stats = {
	        skinned: 0
	    };

      this.sound = this.game.add.audio('skinning');

	    this.init();
    }

    init() {
	    // add object to game
	    this.game.add.existing(this);

      // set object's physics & input
      this.game.physics.arcade.enable(this);

	    // create timer
	    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endSkinning);

	    // create timer loop
	    this.createTimerLoop(1000, this.updateSkinningStation, this);

	    // create stats
	    this.statsBar = new Stats(this.game, this.position.x, this.position.y, this, true, true);
	}

	updateSkinningStation() {
	    this.skinning();
	}

	increaseStack() {
	    // increase stack lvl
      console.log('skinning:',this.attributes.stack.current);
	    if(this.attributes.stack.current + this.attributes.stack.increase <= this.attributes.stack.max) {
	        this.attributes.stack.current += this.attributes.stack.increase;

	        if(this.attributes.stack.current == this.attributes.stack.max) {
	            this.state.full = true;
	        }
	    }
	}

	skinning() {
	    if(this.attributes.stack.current && !Farm.furStorage.state.full) {
	        this.timer.clock.start();
	    }
	}

	endSkinning() {
	    // decrease stack
	    this.attributes.stack.current -= this.attributes.stack.skinning;

	    // count killed animals
	    this.stats.skinned += this.attributes.stack.skinning;
	    Farm.skinned += this.attributes.stack.skinning;

	    // play sound
	    this.sound.play();

	    if(!this.attributes.stack.current) {
	        this.state.full = false;
	    }

	    // stack carcass & furs in storage
	    Farm.furStorage.stackFur();

	    // reset timer
	    this.resetTimer();

	    // create timer
	    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endSkinning);
	}

}

export default SkinningStation;
