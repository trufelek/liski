/*
 * Stats Class
 * Stats properties and methods
*/
class Stats extends Phaser.Sprite {
    constructor(game, x, y, obj, timer, attrs) {
      super(game, x, y);

      this.game = game;

      this.object = obj;
      this.positionX = x;
      this.positionY = y;
	    this.padding = 30;
	    this.height = 10;
	    this.width = 50;

	    this.drawTimerBar = timer;
	    this.drawAttrsBar = attrs;

	    this.timerBar = null;
	    this.attrsBars = [];

	    this.progress = {
	        tint: {
	            full: '0xccff65',
              much: '0xcdffff',
	            medium: '0xccccff',
	            little: '0xffcc66',
	            none: '0xfe6565',
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
	    this.game.add.existing(this);

	    // create timer loop
	    this.game.time.events.loop(60, this.updateStats, this);

	    // draw stats bars
	    this.drawStatsBars();
	}

	drawStatsBars() {
     var offsetTop = 0;
	    if(this.drawTimerBar) {
	        this.timerBar = this.drawBar(offsetTop);
	        this.timerBar.progress = this.timerBar.children[1];
	    }

	   if(this.drawAttrsBar) {
       for(var b in this.object.attributes) {
         this.attrsBars[b] = this.drawBar(offsetTop);
         offsetTop += this.height;
       }
	   }
	}

	drawBar(offsetTop) {
	    var bar = this.game.add.sprite(this.positionX - this.width / 2, this.positionY - this.padding - offsetTop);
	    bar.back = bar.addChild(this.game.add.sprite(0, 0, 'bar_back'));
	    bar.progress = bar.addChild(this.game.add.sprite(0, 0, 'progress_bar'));
	    bar.front = bar.addChild(this.game.add.sprite(0, 0, 'bar'));

      this.game.world.bringToTop(bar);

	    return bar;
	}

	updateStats() {
	    if(this.drawTimerBar) {
	        // update bar progress
	        this.timerBar.progress.tint = this.progress.tint.timer;
	        this.timerBar.progress.width = this.width * this.object.timer.progress / 100;
	    }

	    if(this.drawAttrsBar) {
        for(var a in this.attrsBars) {
	        // attrs bar progress
	        var attr = this.object.attributes[a];
	        var lvl = attr.current * 100 / attr.max;


	        // update bar progress
	        this.attrsBars[a].progress.tint = this.calculateTint(lvl);
	        this.attrsBars[a].progress.width = this.width * lvl / 100;
        }
	    }
	}

	calculateTint(percentage) {
	    // calculates tint of a progress bar
	    var tint;

	    if(percentage >= 80) {
	        tint = this.progress.tint.full;
	    } else if(percentage < 80 && percentage >= 60) {
	        tint = this.progress.tint.much;
      } else if(percentage < 60 && percentage >= 40) {
         tint = this.progress.tint.medium;
	    } else if(percentage < 40 && percentage >= 20) {
	        tint = this.progress.tint.little;
	    } else if (percentage < 20) {
	        tint = this.progress.tint.none;
	    }

	    return tint;
	}
}

export default Stats;
