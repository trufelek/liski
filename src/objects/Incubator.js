/*
 * Incubator Class
 * Incubators properties and methods
*/
import Prefab from 'objects/Prefab';
import Farm from 'objects/Farm';
import Owner from 'objects/Owner';
import Gui from 'objects/Gui';
import Stats from 'objects/Stats';

class Incubator extends Prefab {
    constructor(game, x, y, image, frame, group) {
        super(game, x, y, image, frame, group);

        this.game = game;

        this.actions = {
	        incubate: {
	            label: 'Rozmnażanie',
	            icon: 'action_incubate_icon',
	            position: 'top',
	            enabled: true,
	            visible: true,
	            callback: this.incubate,
	            cost: 1000,
	            income: false,
	            sounds: [this.game.add.audio('incubate1'), this.game.add.audio('incubate2')]
	        }
	    };

	    this.timer = {
	        clock: null,
	        event: null,
	        loops: [],
	        duration: { minutes: 0, seconds: 15 },
	        progress: 0
	    };

	    this.stats = {
	      incubated: 0
	    };

	    this.increase = 25;

	    Incubator.all[Incubator.count] = this;
	    Incubator.count ++;

	    this.init();
    }

    init() {
	    // add object to game
	    this.game.add.existing(this);

	    // create timer
	    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endIncubation);

	    // create stats
	    this.statsBar = new Stats(this.game, this.position.x, this.position.y, this, true, false);
	}

	incubate(incubator) {
	    // disable incubate action
	    incubator.actions.incubate.enabled = false;

	    // play sound
	    var sound = Math.round(Math.random());
	    incubator.actions.incubate.sounds[sound].play();

	    // decrease owner cash
	    Owner.cash -= incubator.actions.incubate.cost;
	    Gui.showCost(incubator.actions.incubate.cost, incubator.actions.incubate.income, incubator.position);

	    //start timer
	    incubator.timer.clock.start();

	    // change texture
	    incubator.loadTexture('incubator_full', 0, false);
	}

	endIncubation() {
	    this.stats.incubated += this.increase;
	    Farm.incubated += this.increase;
	    Incubator.incubated.push(this);
	}

	static dismissAnimals() {
	    // shift incubator from incubated incubators array
	    var incubator = Incubator.incubated.shift();

	    // set action incubate to enabled
	    incubator.actions.incubate.enabled = true;
	    incubator.resetTimer();

	    // create timer again
	    incubator.createTimerEvent(incubator.timer.duration.minutes, incubator.timer.duration.seconds, false, incubator.endIncubation);

	    // change texture
	    incubator.loadTexture('incubator', 0, false);
	}
}

Incubator.all = {};
Incubator.count = 0;
Incubator.incubated = [];

export default Incubator;
