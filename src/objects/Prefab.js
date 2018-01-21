/*
 * Prefab Class
 * Game sprites prototype
*/
import Gui from 'objects/Gui';

class Prefab extends Phaser.Sprite {
    constructor(game, x, y, image, frame, group) {
        super(game, x, y, image, frame, group);

        // main properties
        this.id = Prefab.count;
        this.position = {x: x, y: y};
        this.image = image;
        this.highlight = {hover: '0xfff401', default: '0xffffff'};

        // enable input
        this.inputEnabled = true;
        this.input.useHandCursor = true;

        // add click/touch event listeners
        this.events.onInputDown.add(this.click, this);

        // if desktop add hover/out listeners
        if(game.input.activePointer.isMouse) {
            this.events.onInputOver.add(this.inputOver, this);
            this.events.onInputOut.add(this.inputOut, this);
        }

        this.statsBar = null;

        Prefab.all[this.id] = this;
        Prefab.count ++;
    }

    update() {
        if(this.timer) {
            if(this.timer.event) {
                this.updateTimer();
            }
        }
    }

    inputOver() {
        // highlight object on hover
        this.tint = this.highlight.hover;
    }

    inputOut() {
        // remove highlight from object
        this.tint = this.highlight.default;
    }

    click() {
        if(this.actions) {
            // show actions on click
            Gui.showActions(this, this.position, this.actions);
        }
    }

    createTimerEvent(minutes, seconds, autostart, callback) {
        // create timer event
        this.timer.clock = this.game.time.create();
        this.timer.event = this.timer.clock.add(Phaser.Timer.MINUTE * minutes + Phaser.Timer.SECOND * seconds, callback, this);

        if(autostart) {
            this.timer.clock.start();
        }
    }

    createTimerLoop(interval, callback, obj) {
        // create timer loop
        this.timer.loops.push(this.game.time.events.loop(interval, callback, obj));
    }

    updateTimer() {
        // update timer bar progress
        var time = {};
        time.all = Math.round((this.timer.event.delay));
        time.left = Math.round((this.timer.event.delay - this.timer.clock.ms));
        time.passed = time.all - time.left;

        this.timer.progress = time.passed * 100 / time.all;
        this.timer.progress = this.timer.progress > 100 ? 100 : this.timer.progress;
    }

    resetTimer() {
        // destroy timer
        this.timer.clock.remove(this.timer.event);
        this.timer.clock.destroy();

        this.timer.progress = 0;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

Prefab.all = [];
Prefab.count = 0;

export default Prefab;