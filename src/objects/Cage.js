/*
 * Cage Class
 * Cage properties and methods
*/
import Prefab from 'objects/Prefab';
import Owner from 'objects/Owner';
import Farm from 'objects/Farm';
import Gui from 'objects/Gui';
import Pavilion from 'objects/Pavilion';
import KillingStation from 'objects/KillingStation';
import Incubator from 'objects/Incubator';
import Stats from 'objects/Stats';

class Cage extends Prefab {
    constructor(game, x, y, image, frame, group, enabled, pavilion, type) {
        super(game, x, y, image, frame, group);

        this.game = game;

        this.randomAttribute = Math.random();
        this.randomTimer = Math.floor((Math.random() * 4) + 0);

        this.attributes = {
            condition: {
                max: 100,
                min: 0,
                current: enabled ? 100 : 0,
                label: 'Stan fizyczny zwierząt',
                icon: 'condition_icon',
                min_decrease: 0.5,
                hungry_decrease: 2 + this.randomAttribute,
                crowded_decrease: 0
            },
            psyche: {
              max: 100,
              min: 0,
              current: enabled ? 100 : 0,
              label: 'Stan psychiczny zwierząt',
              icon: 'condition_icon',
              min_decrease: 0.5,
              hungry_decrease: 1 + this.randomAttribute,
              crowded_decrease: 3 + this.randomAttribute
            }
        };

        this.actions = {
            kill: {
                label: 'Zabij',
                icon: 'action_kill_icon',
                position: 'top',
                enabled: false,
                visible: enabled,
                callback: this.kill,
                sounds: [game.add.audio('kill1'),  game.add.audio('kill2'), game.add.audio('kill3')],
                cost: 500,
                income: false
            },
            heal: {
                label: 'Wylecz',
                icon: 'action_heal_icon',
                position: 'top',
                enabled: true,
                visible: false,
                callback: this.heal,
                cost: 1000,
                income: false,
                sound: game.add.audio('heal')
            },
            add: {
                label: 'Dodaj',
                icon: 'action_add_icon',
                position: 'top',
                enabled: false,
                visible: false,
                callback: this.addAnimals,
                sounds: [game.add.audio('add1'), game.add.audio('add2')]
            },
            repair: {
                label: 'Napraw',
                icon: 'action_repair_icon',
                position: 'top',
                enabled: true,
                visible: false,
                callback: this.repair,
                cost: 1000,
                income: false,
                sound: game.add.audio('repair')
            }
        };

        this.state = {
            ready: false,
            sick: false,
            enabled: enabled
        };

        this.timer = {
            clock: null,
            event: null,
            loops: [],
            duration: { minutes: 0, seconds: 15 + this.randomTimer},
            progress: 0
        };

        this.eatingAmount = 1;

        this.tween = null;

        this.pavilion = pavilion;
        this.statsBar = null;
        this.warning = null;

        this.glowTexture = 'paw_' + type + '_glow';

        Cage.all[Cage.count] = this;
        Cage.count ++;

        this.init();
    }

    init() {
        // add object to game
        this.game.add.existing(this);

        // set object's physics & input
        game.physics.arcade.enable(this);
        this.body.setSize(200, 100, 15, 15);
        this.input.priorityID = 9;

        // add to pavilion cages
        this.pavilion.cages.push(this);

        // create timer loop
        this.createTimerLoop(1000, this.updateCage, this);
    }

    inputOver() {
      super.inputOver();

      this.tween = this.game.add.tween(this.pavilion.roof).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
      this.tween.onComplete.add(function(){
        this.pavilion.roof.visible = false;
      }, this);
    }

    inputOut() {
      super.inputOut();

      if(this.tween) this.tween.stop();
      this.pavilion.roof.visible = true;
      var tween = this.game.add.tween(this.pavilion.roof).to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);

    }

    showStats(x, y) {
      // create stats
      this.statsBar = new Stats(this.game, x, y, this, false, true);
    }

    updateCage() {
        // enable/disable actions
        this.updateActions();

        if(this.state.enabled) {
            // eat food
            this.eatingFood();

            // update attributes
            this.updateAttributes();
        }
    }

    updateActions() {
        // update actions
        this.actions.kill.enabled = KillingStation.ready.length && this.state.ready;
    }

    updateAttributes() {
        // if there is no food decrease condition faster
        for(var a in this.attributes) {
          var attr = this.attributes[a];
          var decrease = attr.min_decrease;

          if(Farm.foodStorage.state.empty) {
              decrease += attr.hungry_decrease;
          }

          if(this.pavilion.state.crowded) {
              decrease += attr.crowded_decrease;
          }

          // decrease condition lvl
          if(attr.current - decrease <= attr.min) {
              attr.current = attr.min;
          } else {
              attr.current -= decrease;
          }

          // if condition low add to miserable
          //TODO: refactor this
          if(attr.current == attr.min) {
              if(Cage.miserable.indexOf(this) == -1) {
                  Cage.miserable.push(this);
              }
          }
        }
    }

    eatingFood() {
        // decrease food lvl in food store
        if(!Farm.foodStorage.state.empty) {
            Farm.foodStorage.consumeFood(this.eatingAmount);
        }
    }

    kill(cage) {
        if(KillingStation.ready.length) {
            // kill action
            KillingStation.ready[0].increaseKillStack();
            cage.emptyCage();

            // decrease owner cash
            Owner.cash -= cage.actions.kill.cost;
            Gui.showCost(cage.actions.kill.cost, cage.actions.kill.income, cage.position);

            // play sound
            var sound = cage.getRandomInt(0,2);
            cage.actions.kill.sounds[sound].play();
        }
    }

    addAnimals() {
          // enable cage & set timer
          this.state.enabled = true;

          // change texture
          this.loadTexture('paw_klatki_pelne', 0, false);

          // play sound
          var sound = this.getRandomInt(0,1);
          this.actions.add.sounds[sound].play();

          // set attributes to max
          this.attributes.condition.current = this.attributes.condition.max;
          this.attributes.psyche.current = this.attributes.psyche.max;

          // update actions
          this.actions.add.visible = false;
          this.actions.kill.visible = true;

          // add cage to all full cages
          Cage.full.push(this);

          // add cage to pavilion full cages
          this.pavilion.fullCages.push(this);

          // update pavilion state
          this.pavilion.updateState();

          // create timer
          this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, true, this.cageReady);
    }

    emptyCage() {
        // destroy timer
        this.resetTimer();

        // change texture
        this.loadTexture('paw_klatki_puste', 0, false);

        // reset current cage
        this.state.enabled = false;

        // set attributes to min
        this.attributes.condition.current = this.attributes.condition.min;
        this.attributes.psyche.current = this.attributes.psyche.min;

        //update actions
        this.actions.add.visible = true;
        this.actions.kill.visible = false;

        // remove cage from all full cages
        if(Cage.full.indexOf(this) > -1) {
            Cage.full.splice(Cage.full.indexOf(this), 1);
        }

        // remove cage from pavilion full cages
        if(this.pavilion.fullCages.indexOf(this) > -1) {
            this.pavilion.fullCages.splice(this.pavilion.fullCages.indexOf(this), 1);
        }

        // remove if cage in miserable
        if(Cage.miserable.indexOf(this) > -1) {
            Cage.miserable.splice(Cage.miserable.indexOf(this), 1);
        }

        // update pavilion state
        this.pavilion.updateState();
    }

    escapeFromCage() {
        // destroy timer
        this.resetTimer();

        // change texture
        // TODO: add texture
        //this.loadTexture('cage_double_broken', 0, false);

        // show warning
        this.warning = Gui.showWarning(this.position, 'warning_broken');

        // reset current cage
        this.state.enabled = false;

        // set attributes to min
        this.attributes.condition.current = this.attributes.condition.min;
        this.attributes.psyche.current = this.attributes.psyche.min;

        //update actions
        this.actions.repair.visible = true;
        this.actions.kill.visible = false;

        // remove cage from all full cages
        if(Cage.full.indexOf(this) > -1) {
            Cage.full.splice(Cage.full.indexOf(this), 1);
        }

        // remove cage from pavilion full cages
        if(this.pavilion.fullCages.indexOf(this) > -1) {
            this.pavilion.fullCages.splice(this.pavilion.fullCages.indexOf(this), 1);
        }

        // remove if cage in miserable
        if(Cage.miserable.indexOf(this) > -1) {
            Cage.miserable.splice(Cage.miserable.indexOf(this), 1);
        }

        // update pavilion state
        this.pavilion.updateState();
    }

    repair(cage) {
      // play sound
      cage.actions.repair.sound.play();

      // decrease owner cash
      Owner.cash -= cage.actions.repair.cost;
      Gui.showCost(cage.actions.repair.cost, cage.actions.repair.income, cage.position);

      // change texture
      cage.loadTexture('paw_klatki_puste', 0, false);

      // hide warning
      Gui.hideWarning(cage.warning);
      cage.warning = null;

      //update actions
      cage.actions.add.visible = true;
      cage.actions.repair.visible = false;
    }

    sick() {
        // change texture
        // TODO: add texture
        //this.loadTexture('cage_double_sick', 0, false);

        // show warning
        this.warning = Gui.showWarning(this.position, 'warning_sick');

        // add to all sick cages
        if(Cage.sick.indexOf(this) == -1) {
            Cage.sick.push(this);
        }

        // add to pavilion sick cages
        if(this.pavilion.sickCages.indexOf(this) == -1) {
            this.pavilion.sickCages.push(this);
        }

        //update actions
        this.actions.heal.visible = true;
        this.actions.kill.visible = false;

        // update state
        this.state.sick = true;
    }

    heal(cage) {
        // play sound
        cage.actions.heal.sound.play();

        // decrease owner cash
        Owner.cash -= cage.actions.heal.cost;
        Gui.showCost(cage.actions.heal.cost, cage.actions.heal.income, cage.position);

        // hide warning
        Gui.hideWarning(cage.warning);
        cage.warning = null;

        // remove from all sick cages
        if(Cage.sick.indexOf(cage) > -1) {
            Cage.sick.splice(Cage.sick.indexOf(cage), 1);
        }

        // remove from pavilion sick cages
        if(cage.pavilion.sickCages.indexOf(cage) > -1) {
            cage.pavilion.sickCages.splice(cage.pavilion.sickCages.indexOf(cage), 1);
        }

        // if there is no sick cages remove pavilion from epidemic group and update its state
        if(!cage.pavilion.sickCages.length) {
            if(Pavilion.epidemic.indexOf(cage.pavilion) > -1) {
                Pavilion.epidemic.splice(Cage.sick.indexOf(Pavilion.epidemic.indexOf(cage.pavilion)), 1);
            }

            cage.pavilion.state.epidemic = false;
        }

        // change texture
        cage.loadTexture('paw_klatki_pelne', 0, false);

        //update actions
        cage.actions.kill.visible = true;
        cage.actions.heal.visible = false;

        // update state
        cage.state.sick = false;
    }

    dieFromSickness() {
        // play kill sound
        this.actions.kill.sounds[0].play();

        // hide warning
        Gui.hideWarning(this.warning);
        this.warning = null;

        // remove from all sick cages
        if(Cage.sick.indexOf(this) > -1) {
            Cage.sick.splice(Cage.sick.indexOf(this), 1);
        }

        // if there is no sick cages remove pavilion from epidemic group and update its state
        if(!this.pavilion.sickCages.length) {
            if(Pavilion.epidemic.indexOf(this.pavilion) > -1) {
                Pavilion.epidemic.splice(Cage.sick.indexOf(Pavilion.epidemic.indexOf(this.pavilion)), 1);
            }

            this.pavilion.state.epidemic = false;
        }

        // update state
        this.state.sick = false;
        this.actions.heal.visible = false;

        // destroy timer
        this.resetTimer();

        // change texture
        this.loadTexture('paw_klatki_puste', 0, false);

        // reset current cage
        this.state.enabled = false;

        // set attributes to min
        this.attributes.condition.current = this.attributes.condition.min;
        this.attributes.psyche.current = this.attributes.psyche.min;

        //update actions
        this.actions.add.visible = true;
        this.actions.kill.visible = false;

        // remove cage from all full cages
        if(Cage.full.indexOf(this) > -1) {
            Cage.full.splice(Cage.full.indexOf(this), 1);
        }

        // remove cage from pavilion full cages
        if(this.pavilion.fullCages.indexOf(this) > -1) {
            this.pavilion.fullCages.splice(this.pavilion.fullCages.indexOf(this), 1);
        }

        // remove if cage in miserable
        if(Cage.miserable.indexOf(this) > -1) {
            Cage.miserable.splice(Cage.miserable.indexOf(this), 1);
        }
    }

    cageReady() {
        // cage ready to kill
        this.actions.kill.enabled = true;
        this.state.ready = true;
    }
}

Cage.all = {};
Cage.count = 0;
Cage.full = [];
Cage.sick = [];
Cage.miserable = [];

export default Cage;
