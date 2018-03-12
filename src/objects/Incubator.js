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
    constructor(game, x, y, image, frame, group, type) {
      super(game, x, y, image, frame, group);

      this.game = game;
      this.random = Math.floor((Math.random() * 4) + 0);
      this.type = type;

      this.actions = {
        incubate: {
            label: 'Rozmnażanie',
            icon: 'action_incubate_icon',
            position: 'top',
            enabled: false,
            visible: false,
            callback: this.incubate,
            cost: 1000,
            income: false,
            sounds: [this.game.add.audio('incubate1'), this.game.add.audio('incubate2')]
        },
        separate: {
            label: 'Separacja',
            icon: 'action_add_icon',
            position: 'top',
            enabled: false,
            visible: false,
            callback: this.seperate,
            cost: 1000,
            income: false,
            sounds: [this.game.add.audio('add1'), this.game.add.audio('add2')]
        }
      };

	    this.timer = {
	        clock: null,
	        event: null,
	        loops: [],
	        duration: { minutes: 0, seconds: 5 + this.random},
	        progress: 0
	    };

      this.glowTexture = 'inku_glow_' + type;

      this.incubated = false;
	    this.increase = 25;

	    Incubator.all[Incubator.count] = this;
	    Incubator.count ++;

	    this.init();
    }

    init() {
	    // add object to game
	    this.game.add.existing(this);

      // add drag & drop image
      this.drag = this.game.add.sprite(this.position.x, this.position.y, 'drag', 0);
      this.drag.alpha = 0;
      this.drag.anchor.set(0.5);

      // add drag & drop events
      this.drag.events.onDragStart.add(this.onDragStart, this);
      this.drag.events.onDragStop.add(this.onDragStop, this);
      this.drag.originalPosition = this.drag.position.clone();

      this.drag.events.onInputOver.add(function(){
        if(this.incubated) {
          this.game.canvas.style.cursor = "url('../assets/img/gui/grab.png'), auto";
        }
      }, this);

	    // create timer
	    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endIncubation);

	    // create stats
	    this.statsBar = new Stats(this.game, this.position.x, this.position.y, this, true, false);

      // create timer loop
      this.createTimerLoop(1000, this.updateActions, this);

      this.incubate(this, false);
	}

  updateActions() {
      // update actions
      this.actions.incubate.visible = this.game.season == 'jesień';
      this.actions.separate.visible = this.game.season != 'wiosna';
  }

  click() {
    if(this.actions && !this.incubated) {
        // show actions on click
        Gui.showActions(this, this.position, this.actions);
    }
  }

  onDragStart(sprite, pointer) {
    this.drag.alpha = 1;
    this.game.canvas.style.cursor = "url('../assets/img/gui/grabbing.png'), auto";

    // show cages
    for(var p in Farm.pavilions) {
      var pavilion = Farm.pavilions[p];
      pavilion.roof.visible = false;
    }
  }

  onDragStop(sprite) {
    var overlapped = [];
    this.game.canvas.style.cursor = 'pointer';

    // hide cages
    for(var p in Farm.pavilions) {
      var pavilion = Farm.pavilions[p];
      pavilion.roof.visible = true;
    }

    // check every overlapping cage
    for (var cage in Farm.cages) {
      var overlap =  game.physics.arcade.overlap(sprite, Farm.cages[cage]);

      if(overlap && !Farm.cages[cage].state.enabled) {
            overlapped.push(Farm.cages[cage]);
      }
    }

    if(overlapped.length) {
      // chooce closest cage
      var overlappedSorted = overlapped.sort(function (a, b) {
        return a.id - b.id
      });

      // activate cage
      var cage = overlappedSorted[overlappedSorted.length - 1];

      // change sprite position
      sprite.position.x = cage.position.x;
      sprite.position.y = cage.position.y;
      sprite.inputEnabled = false;
      sprite.input.draggable = false;
      sprite.alpha = 0;
      sprite.anchor.set(0.5);

      // move animals to cage
      this.dismissAnimals();
      cage.addAnimals();
    } else {
      // sprite is back to origin position
      sprite.position.copyFrom(sprite.originalPosition);
      sprite.inputEnabled = true;
      sprite.alpha = 0;
    }
  }

  separate(incubator) {
    // TODO: separate from cage function
  }

	incubate(incubator, enableSound = true) {
	    // disable incubate action
	    incubator.actions.incubate.enabled = false;

	    // play sound
      if(enableSound) {
        var sound = Math.round(Math.random());
  	    incubator.actions.incubate.sounds[sound].play();
      }

	    // decrease owner cash
	    Owner.cash -= incubator.actions.incubate.cost;
	    Gui.showCost(incubator.actions.incubate.cost, incubator.actions.incubate.income, incubator.position);

	    //start timer
	    incubator.timer.clock.start();
	}

	endIncubation() {
      this.incubated = true;

	    Farm.incubated += this.increase;
	    Incubator.incubated.push(this);
      Incubator.ready ++;

      // enable drag & drop
      this.drag.inputEnabled = true;
      this.drag.input.enableDrag();
      this.game.world.bringToTop(this.drag);
      game.physics.arcade.enable(this.drag);
      this.drag.input.priorityID = 2;

      // change texture
	    this.loadTexture('inku_full_' + this.type , 0, false);

      if(Incubator.count == Incubator.ready) {
        this.game.conditions[this.game.season].allIncubated = true;
      }
	}

	dismissAnimals() {
	    // shift incubator from incubated incubators array
      if (Incubator.incubated.indexOf(this) > -1) {
          Incubator.incubated.splice(Incubator.incubated.indexOf(this), 1);
      }

      this.incubated = false;

      if(!Incubator.incubated.length) {
        Incubator.ready = 0;
        this.game.conditions[this.game.season].allInCages = true;
      }

	    // set action incubate to enabled
	    this.actions.incubate.enabled = true;
	    this.resetTimer();

	    // create timer again
	    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endIncubation);

	    // change texture
	    this.loadTexture('inku_empty_' + this.type, 0, false);
	}
}

Incubator.all = {};
Incubator.ready = 0;
Incubator.count = 0;
Incubator.incubated = [];

export default Incubator;
