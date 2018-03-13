/*
 * Stats Class
 * Stats properties and methods
*/
class Stats extends Phaser.Sprite {
    constructor(game, x, y, obj, timer, attrs) {
      super(game, x, y);

      this.game = game;

      this.object = obj;
	    this.padding = 30;
	    this.height = 10;
	    this.width = 50;

	    this.drawTimerBar = timer;
	    this.drawAttrsBar = attrs;

	    this.timerBar = null;
	    this.attrsBar = null;

	    this.progress = {
	        tint: {
	            full: '0x97d143',
	            almost: '0xfff855',
	            little: '0xffab55',
	            none: '0xff5855',
	            timer: '0xff8080'
	        }
	    };

	    this.timer = {
	        clock: null,
	        event: null,
	        loops: []
	    };

	    this.init();
    }

    init() {
	    // add object to game
	    //this.game.add.existing(this);

	    // create timer loop
	    this.game.time.events.loop(60, this.updateStats, this);

	    // draw stats bars
	    this.drawStatsBars();
	}

	drawStatsBars() {
	    if(this.drawTimerBar) {
	        this.timerBar = this.drawBar(-25, -25);
	        this.timerBar.progress = this.timerBar.children[1];
	    }

	   if(this.drawAttrsBar) {
	       this.attrsBar = this.drawBar(-25, -25);
	       this.attrsBar.progress = this.attrsBar.children[1];
	   }
	}

	drawBar(x, y) {
	    var bar = this.object.addChild(this.game.add.sprite(x, y));
	    bar.addChild(this.game.add.sprite(0, 0, 'bar_back'));
	    bar.addChild(this.game.add.sprite(0, 0, 'progress_bar'));
	    bar.addChild(this.game.add.sprite(0, 0, 'bar'));

      this.game.world.bringToTop(bar);

	    return bar;
	}

	updateStats() {
	    if(this.drawTimerBar) {
	        // update bar progress
	        this.timerBar.progress.tint = this.progress.tint.timer;
	        this.timerBar.progress.width = this.width * this.object.timer.progress / 100;
	    }

	    // if(this.drawAttrsBar) {
	    //     // attrs bar progress
	    //     var attr_key = Object.keys(this.object.attributes)[0];
	    //     var attr = this.object.attributes[attr_key];
	    //     var lvl = attr.current * 100 / attr.max;
      //
      //
	    //     // update bar progress
	    //     this.attrsBar.progress.tint = this.calculateTint(lvl);
	    //     this.attrsBar.progress.width = this.width * lvl / 100;
	    // }
	}

	calculateTint(percentage) {
	    // calculates tint of a progress bar
	    var tint;

	    if(percentage >= 80) {
	        tint = this.progress.tint.full;
	    } else if(percentage < 80 && percentage >= 50) {
	        tint = this.progress.tint.almost;
	    } else if(percentage < 50 && percentage >= 25) {
	        tint = this.progress.tint.little;
	    } else if (percentage < 25) {
	        tint = this.progress.tint.none;
	    }

	    return tint;
	}
}

export default Stats;
