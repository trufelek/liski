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

        this.randomHealthFactor = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
        this.randomPsycheFactor = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
        this.randomDeathsFactor = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
        this.randomCleannesFactor = Math.floor(Math.random() * (10 - 10 + 1)) + 10;

        this.attributes = {
            psyche: {
              max: 100,
              min: 0,
              current: 0,
              decrease: this.randomPsycheFactor,
              hungry_decrease: 1,
              crowded_decrease: 3,
              level: 0,
              visible: false,
              visibleMode: 'healing',
              position: 0
            },
            health: {
                max: 100,
                min: 0,
                current: 0,
                decrease: this.randomHealthFactor,
                hungry_decrease: 3,
                crowded_decrease: 1,
                level: 0,
                visible: false,
                visibleMode: 'healing',
                position: 1
            },
            cleanness: {
              max: 100,
              min: 0,
              current: 0,
              increase: this.randomCleannesFactor,
              hungry_increase: 0,
              crowded_increase: 1,
              level: 0,
              visible: false,
              visibleMode: 'cleaning',
              position: 0
            },
            foxes: {
              max: 100,
              min: 0,
              current: 0,
              decrease: this.randomDeathsFactor,
              hungry_decrease: 1,
              crowded_decrease: 1,
              level: 0,
              visible: false,
              visibleMode: 'killing',
              position: 0
            }
        };

        this.actions = {
          add: {
              sounds: [game.add.audio('add1'), game.add.audio('add2')]
          },
          heal: {
              cost: 300,
              income: false,
              sound: game.add.audio('heal')
          },
          kill: {
              sounds: [game.add.audio('kill1'),  game.add.audio('kill2'), game.add.audio('kill3')],
              sound: game.add.audio('electric'),
              cost: 500,
              income: false
          },
          clean: {
              cost: 200,
              income: false,
              sound: game.add.audio('clean')
          },
          repair: {
              cost: 1000,
              income: false,
              sound: game.add.audio('repair')
          }
        };

        this.state = {
            ready: true,
            sick: false,
            enabled: enabled
        };

        this.timer = {
            clock: null,
            event: null,
            loops: []
        };

        this.illness = false;

        this.eatingAmount = 5;

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
        this.createTimerLoop(5000, this.updateCage, this);
        this.createTimerLoop(60, this.updateAttrsVisibility, this);
    }

    inputOver() {
      super.inputOver();

      if(this.state.enabled && this.game.toolsMode == 'default') {
        this.game.canvas.style.cursor = this.game.cursor.hand;
      } else {
        this.game.canvas.style.cursor = this.game.currentCursor;
      }

      this.tween = this.game.add.tween(this.pavilion.roof).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
      this.tween.onComplete.add(function(){
        this.pavilion.roof.visible = false;
      }, this);
    }

    inputOut() {
      super.inputOut();

      this.game.canvas.style.cursor = this.game.currentCursor;

      if(this.tween) this.tween.stop();
      this.pavilion.roof.visible = true;
      var tween = this.game.add.tween(this.pavilion.roof).to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    }

    click() {
      if(this.game.toolsMode == 'healing' && this.state.sick) {
        this.heal();
      } else if(this.game.toolsMode == 'killing' && this.state.enabled && this.state.ready) {
        this.kill();
      } else if(this.game.toolsMode == 'cleaning') {
        this.clean();
      }
    }

    showStats(x, y) {
      // create stats
      this.statsBar = new Stats(this.game, x, y, this, false, true);
    }

    updateAttrsVisibility() {
      for(var a in this.attributes) {
        var attr = this.attributes[a];
        attr.visible = this.game.toolsMode == attr.visibleMode;
      }
    }

    updateCage() {
        if(this.state.enabled) {
            // eat food
            this.eatingFood();

            // update attributes
            this.updateAttributes();

            //update condition
            this.updateCageCondition();
        }
    }

    updateAttributes() {
        for(var a in this.attributes) {
          var attr = this.attributes[a];

          // decrease attributes
          if(attr.hasOwnProperty('decrease')) {
            var decrease = attr.decrease;

            if(attr.hasOwnProperty('hungry_decrease') && Farm.foodStorage.state.empty) {
                decrease += attr.hungry_decrease;
            }

            if(attr.hasOwnProperty('crowded_decrease') && this.pavilion.state.crowded) {
                decrease += attr.crowded_decrease;
            }

            if(attr.current - decrease <= attr.min) {
                attr.current = attr.min;
            } else {
                attr.current -= decrease;
            }
          }

          // increase attributes
          if(attr.hasOwnProperty('increase')) {
            var increase = attr.increase;

            if(attr.hasOwnProperty('hungry_increase') && Farm.foodStorage.state.empty) {
                increase += attr.hungry_increase;
            }

            if(attr.hasOwnProperty('crowded_increase') && this.pavilion.state.crowded) {
                increase += attr.crowded_increase;
            }

            if(attr.current + increase >= attr.max) {
                attr.current = attr.max;
            } else {
                attr.current += increase;
            }
          }
        }
    }

    updateCageCondition () {
      var healthDiseases = ['nosówka', 'choroby jamy ustnej', 'choroby oczu',];
      var mentalDiseases = ['nosówka', 'agresja/ autoagresja', 'apatia / zachowania stereotypowe'];
      var healthTints = ['0xff4000', '0xff9a00', '0xa3ff00'];
      var mentalTints = ['0xc9600ff','0x0045ff', '0x00f9ff'];
      var tint;

      var contagious = 0;
      var health = this.attributes.health.level;
      var psyche = this.attributes.psyche.level;


      if(health < 3 || psyche < 3) {
        if(health < psyche) {
          // healt diseases
          tint = healthTints[health];
          this.ilness = healthDiseases[health];
        } else {
          // mental diseases
          tint = mentalTints[psyche];
          this.ilness = mentalDiseases[psyche];
        }

        var c = health + psyche;

        contagious = 100 / (c > 0 ? (c == 1 ? c + 0.25 : c) : c + 1);

        if(!this.state.sick) {
          this.sick();
        }

        this.warning.tint = tint;

        if(health == 0 && psyche == 0) {
          this.die();
        }
      }
    }

    eatingFood() {
        // decrease food lvl in food store
        if(!Farm.foodStorage.state.empty) {
            Farm.foodStorage.consumeFood(this.eatingAmount);
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
      this.attributes.foxes.current = this.attributes.foxes.max;
      this.attributes.health.current = this.attributes.health.max;
      this.attributes.psyche.current = this.attributes.psyche.max;

      // add cage to all full cages
      Cage.full.push(this);

      // add cage to pavilion full cages
      this.pavilion.fullCages.push(this);

      // update pavilion state
      this.pavilion.updateFullCages();
    }

    sick() {
      // update state
      this.state.sick = true;

      // show warning
      this.warning = Gui.showWarning(this.worldPosition, 'warning_sick');

      // add to all sick cages
      Cage.sick.push(this);

      // add to pavilion sick cages
      this.pavilion.sickCages.push(this);

      // update pavilion state
      this.pavilion.updateSickCages();
    }

    heal() {
      // update state
      this.state.sick = false;

      // hide warning
      Gui.hideWarning(this.warning);
      this.warning = null;

      // remove from all sick cages
      Cage.sick.splice(Cage.sick.indexOf(this), 1);

      // remove from pavilion sick cages
      this.pavilion.sickCages.splice(this.pavilion.sickCages.indexOf(this), 1);

      // play sound
      this.actions.heal.sound.play();

      // heal cage
      this.attributes.health.level += this.attributes.health.level < 3 ? 1 : 0;
      this.attributes.psyche.level += this.attributes.psyche.level < 3 ? 1 : 0;
      this.attributes.health.current = this.attributes.health.max / 3 * this.attributes.health.level - 1;
      this.attributes.psyche.current = this.attributes.psyche.max / 3 * this.attributes.psyche.level - 1;

      // decrease owner cash
      Owner.cash -= this.actions.heal.cost;
      Gui.showCost(this.actions.heal.cost, this.actions.heal.income, this.worldPosition);

      // update pavilion state
      this.pavilion.updateSickCages();
    }

    clean() {
      // play sound
      this.actions.clean.sound.play();

      // decrease owner cash
      Owner.cash -= this.actions.clean.cost;
      Gui.showCost(this.actions.clean.cost, this.actions.clean.income, this.worldPosition);

      // update cleanness attribute
      this.attributes.cleanness.level -= this.attributes.cleanness.level > 0 ? 1 : 0;
      this.attributes.cleanness.current = this.attributes.cleanness.max / 3 * this.attributes.cleanness.level - (this.attributes.cleanness.level > 0 ? 1 : 0);
    }

    die() {
      // update state
      this.state.sick = false;
      this.state.enabled = false;

      // change texture
      this.loadTexture('paw_klatki_puste', 0, false);

      // play kill sound
      this.actions.kill.sounds[0].play();

      // hide warning
      if(this.warning) {
        Gui.hideWarning(this.warning);
        this.warning = null;
      }

      // remove cage from all full cages
      Cage.full.splice(Cage.full.indexOf(this), 1);

      // remove from all sick cages
      if(Cage.sick.indexOf(this) > -1) {
          Cage.sick.splice(Cage.sick.indexOf(this), 1);
      }

      // set attributes to min
      this.attributes.foxes.current = this.attributes.foxes.min;
      this.attributes.health.current = this.attributes.health.min;
      this.attributes.psyche.current = this.attributes.psyche.min;
      this.attributes.cleanness.current = this.attributes.cleanness.min;

      // update pavilion state
      this.pavilion.updateState();
    }

    kill() {
      // play sound
      this.actions.kill.sound.play();

      this.die();
    }

    emptyCage() {
        // change texture
        this.loadTexture('paw_klatki_puste', 0, false);
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
        this.attributes.health.current = this.attributes.health.min;
        this.attributes.psyche.current = this.attributes.psyche.min;

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
}

Cage.all = {};
Cage.count = 0;
Cage.full = [];
Cage.sick = [];

export default Cage;
