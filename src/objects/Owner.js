/*
 * Owner Class
 * Player properties and methods
*/
import Simulator from 'objects/Simulator';

class Owner {
  constructor() {
    this.cash = 100000;
    this.minCash = -5000;

    this.timer = {
      clock: null,
      event: null,
      loop: null
    };
  }

  init() {
    // define game & timer
    this.game = window.game;
    this.createTimer();
  }

  createTimer() {
    // create timer & timer event & timer loop
    this.timer.clock = this.game.time.create();
    this.timer.loop = this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.updateCash, this);

    //start timer
    this.timer.clock.start();
  }

  updateCash () {
    if(this.cash > this.minCash) {
      this.cash -= 1;
    } else {
      Events.gameOver();
    }
  }
}

export default new Owner();
