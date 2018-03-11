/*
 * Pavilion Class
 * Cages container
*/
import Prefab from 'objects/Prefab';
import Cage from 'objects/Cage';

class Pavilion extends Phaser.Sprite{
    constructor(game, x, y, image, frame, group) {
        super(game, x, y, image, frame, group);
        this.game = game;

        this.cages = [];
        this.fullCages = [];
        this.sickCages = [];

        this.front = null;
        this.roof = null;

        this.timer = {
            clock: null,
            event: null,
            loops: []
        };

        this.state = {
            crowded: false,
            epidemic: false
        };

        Pavilion.count ++;
        Pavilion.all.push(this);
        this.id = Pavilion.count;

        this.init();
    }

    init() {
        // add object to game
        this.game.add.existing(this);
    }

    updateState() {
        // update pavilion state
        if(this.fullCages.length > 8) {
            this.state.crowded = true;

            if(Pavilion.crowded.indexOf(this) == -1) {
                Pavilion.crowded.push(this);
            }
        } else {
            if(Pavilion.crowded.indexOf(this) > -1) {
                Pavilion.crowded.splice(Pavilion.crowded.indexOf(this), 1);
            }

            this.state.crowded = false;
        }
    }
}

Pavilion.all = [];
Pavilion.count = 0;
Pavilion.crowded = [];
Pavilion.epidemic = [];


export default Pavilion;
