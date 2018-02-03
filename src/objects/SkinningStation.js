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

	    this.id = SkinningStation.count;

	    this.attributes = {
	        stack: {
	            max: 50,
	            min: 0,
	            current: 0,
	            label: 'Ilość zwierząt',
	            icon: 'kill_stock_icon',
	            increase: 50,
	            decrease: 2
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

	    this.init();

	    this.sound = this.game.add.audio('skinning');

	    SkinningStation.all[this.id] = this;
	    SkinningStation.ready.push(this);
	    SkinningStation.count ++;
    }

    init() {
	    // add object to game
	    this.game.add.existing(this);

	    // create timer
	    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endSkinning);

	    // create timer loop
	    this.createTimerLoop(1000, this.updateSkinningStation, this);

	    // create stats
	    this.statsBar = new Stats(this.game, this.position.x, this.position.y, this, true, true);
	    this.statsBar.timerBar.alpha = 0;
	    this.statsBar.attrsBar.alpha = 0;
	}

	updateSkinningStation() {
	    this.skinning();
	}

	increaseSkinStack() {
	    // increase stack lvl
	    if(this.attributes.stack.current + this.attributes.stack.increase <= this.attributes.stack.max) {
	        this.attributes.stack.current += this.attributes.stack.increase;

	        if(this.attributes.stack.current == this.attributes.stack.max) {
	            this.state.full = true;
	            SkinningStation.ready.shift();
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
	    this.attributes.stack.current -= this.attributes.stack.decrease;

	    // count killed animals
	    this.stats.skinned += this.attributes.stack.decrease;
	    Farm.skinned += this.attributes.stack.decrease;

	    // play sound
	    this.sound.play();

	    if(!this.attributes.stack.current) {
	        this.state.full = false;

	        if(SkinningStation.ready.indexOf(this) == -1) {
	            SkinningStation.ready.unshift(this);
	        }
	    }

	    // stack carcass & furs in storage
	    Farm.furStorage.stackFur();

	    // reset timer
	    this.resetTimer();

	    // create timer
	    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endSkinning);
	}

}

SkinningStation.all = {};
SkinningStation.count = 0;
SkinningStation.ready = [];

export default SkinningStation;
