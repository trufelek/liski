/*
 * Alert Class
 * Alert properties and methods
*/
class Alert extends Phaser.Sprite {
    constructor(game, x, y, obj) {
      super(game, x, y);

      this.game = game;

      this.object = obj;
	    this.warning = null;
	    this.sound = this.game.add.audio('alert_beep');

	    this.init();
    }

    init() {
	    // add object to game
	    this.game.add.existing(this);

	    // draw alert
	    this.drawAlert();

	    // create timer loop
	    this.game.time.events.loop(60, this.updateAlert, this);
	}

	drawAlert() {
	    if(!this.object.alert) {
	        this.warning = this.game.add.sprite(this.object.position.x, this.object.position.y - 25, 'alert');
	        this.warning.anchor.setTo(0.5);

	        this.sound.loopFull(0.5);

	        this.game.add.tween(this.warning.scale).to( { x: 1.5, y: 1.5 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
	    }
	}

	updateAlert() {
	    if(this.object.inCamera) {
	        this.sound.volume = 0.7;
	    } else {
	        this.sound.volume = 0.3;
	    }
	}

	hideAlert() {
	    if(this.object.alert) {
	        this.sound.destroy();
	        this.warning.destroy();
	        this.object.alert = null;
	    }
	}
}

export default Alert;
