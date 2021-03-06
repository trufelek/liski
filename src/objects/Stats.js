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

	    this.timer = {
	        clock: null,
	        event: null,
	        loops: []
	    };

      this.tints = {
        timer: '0xff8080',
        health: '0xccff65',
        psyche: '0xccccff',
        cleanness: '0xcdffff',
        foxes: '0xfe6565',
        food: '0x00f9ff',
        carcass: '0x00f9ff',
        fur: '0x00f9ff',
        stack: '0x00f9ff'
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
	    if(this.drawTimerBar) {
	        this.timerBar = this.drawBar(0, 'timer');
	        this.timerBar.progress = this.timerBar.children[1];
	    }

	   if(this.drawAttrsBar) {
       for(var b in this.object.attributes) {
          var offsetTop = 0;

           if(this.object.attributes[b].position) {
             offsetTop = this.height * this.object.attributes[b].position;
           }
           this.attrsBars[b] = this.drawBar(offsetTop, b);
       }
	   }
	}

	drawBar(offsetTop, attr) {
      var x = this.positionX - this.width / 2;
      var y = this.positionY - this.padding - offsetTop;
	    var bar = this.game.add.sprite(x, y);
	    bar.back = bar.addChild(this.game.add.sprite(0, 0, 'bar_back'));
	    bar.progress = bar.addChild(this.game.add.sprite(0, 0, 'progress_bar'));
      bar.progress.tint = this.tints[attr];
	    bar.front = bar.addChild(this.game.add.sprite(0, 0, attr == 'timer' ? 'timer_bar' :'bar'));

      this.game.world.bringToTop(bar);

	    return bar;
	}

	updateStats() {
	    if(this.drawTimerBar) {
	        // update time bar progress
	        this.timerBar.progress.tint = this.tints.timer;
	        this.timerBar.progress.width = this.width * this.object.timer.progress / 100;
	    }

	    if(this.drawAttrsBar) {
        for(var a in this.attrsBars) {
	        // attrs bar progress & current level
	        var attr = this.object.attributes[a];
	        var lvl = attr.current * 100 / attr.max;

          // show/hide attrs
          this.attrsBars[a].alpha = attr.visible ? 1 : 0;

	        // update bar progress
	        this.attrsBars[a].progress.width = attr.hasOwnProperty('decrease') ? this.calculateBarWidth(lvl) : this.calculateIncBarWidth(lvl);
          attr.level = attr.hasOwnProperty('decrease') ? this.calculateAttributeLevel(lvl) : this.calculateIncAttributeLevel(lvl);
        }
	    }
	}

  calculateBarWidth(percentage) {
      var width = 0;

      if(percentage >= 66.6) {
        width = this.width * 100 / 100;
      } else if(percentage >= 33.3) {
        width = this.width * 66.6 / 100;
      } else if(percentage > 0) {
        width = this.width * 33.3 / 100;
      }

      return width;
  }

  calculateAttributeLevel(percentage) {
      var level = 0;

	    if(percentage >= 66.6) {
        level = 3;
      } else if(percentage >= 33.3) {
        level = 2;
      } else if(percentage > 0) {
        level = 1;
      }

      return level;
	}

  calculateIncBarWidth(percentage) {
      var width = 0;

      if(percentage == 100) {
        width = this.width * 100 / 100;
      } else if(percentage >= 66.6) {
        width = this.width * 66.6 / 100;
      } else if(percentage >= 33.3) {
        width = this.width * 33.3 / 100;
      }

      return width;
  }

  calculateIncAttributeLevel(percentage) {
      var level = 0;

	    if(percentage == 100) {
        level = 3;
      } else if(percentage >= 66.6) {
        level = 2;
      } else if(percentage >= 33.3) {
        level = 1;
      }

      return level;
	}
}

export default Stats;
