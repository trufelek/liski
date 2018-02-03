/*
 * KillingStation Class
 * Killing stations properties and methods
*/
import Prefab from 'objects/Prefab';
import Farm from 'objects/Farm';
import SkinningStation from 'objects/SkinningStation';
import Stats from 'objects/Stats';

class KillingStation extends Prefab {
  constructor(game, x, y, image, frame, group) {
    super(game, x, y, image, frame, group);

    this.game = game;

    this.id = KillingStation.count;

    this.attributes = {
      stack: {
        max: 50,
        min: 0,
        current: 0,
        label: 'Ilość zwierząt',
        icon: 'kill_stock_icon',
        increase: 25,
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
      killed: 0
    };

    this.sound = this.game.add.audio('killing');

    this.init();

    KillingStation.all[this.id] = this;
    KillingStation.ready.push(this);
    KillingStation.count ++;
  }

  init() {
    // add object to game
    this.game.add.existing(this);

    // create timer
    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endKilling);

    // create timer loop
    this.createTimerLoop(1000, this.updateKillingStation, this);

    // create stats
    this.statsBar = new Stats(this.game, this.position.x, this.position.y, this, true, true);
    this.statsBar.timerBar.alpha = 0;
    this.statsBar.attrsBar.alpha = 0;
  }

  updateKillingStation() {
    if(this.state.full) {
      this.killing();
    }
  }

  increaseKillStack() {
    // increase stack lvl
    if(this.attributes.stack.current + this.attributes.stack.increase <= this.attributes.stack.max) {
      this.attributes.stack.current += this.attributes.stack.increase;

      if(this.attributes.stack.current == this.attributes.stack.max) {
        this.state.full = true;
        KillingStation.ready.shift();
      }
    }
  }

  endKilling() {
    // decrease stack
    this.attributes.stack.current -= this.attributes.stack.decrease;

    // count killed animals
    this.stats.killed += this.attributes.stack.decrease;
    Farm.killed += this.attributes.stack.decrease;

    // play sound
    this.sound.play();

    if(!this.attributes.stack.current && SkinningStation.ready.length) {
      this.state.full = false;

      if(KillingStation.ready.indexOf(this) == -1) {
        KillingStation.ready.unshift(this);

        // update skinnign stations
        SkinningStation.ready[0].increaseSkinStack();
      }
    }

    // stack carcass & furs in storage
    Farm.carcassStorage.stackCarcass();

    // reset timer
    this.resetTimer();

    // create timer
    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endKilling);
  }

  killing() {
    if(this.attributes.stack.current && !Farm.carcassStorage.state.full) {
      this.timer.clock.start();
    }
  }
}

KillingStation.all = {};
KillingStation.count = 0;
KillingStation.ready = [];

export default KillingStation;
