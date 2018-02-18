/*
 * Gui Class
 * User interface properties and methods
*/
import Simulator from 'objects/Simulator';
import Owner from 'objects/Owner';

class Gui {
  constructor() {
    this.styles = {
      font: '14px Arial',
      fill: '#000000',
      wordWrap: false,
      align: 'left'
    };

    this.heading = {
      font: 'bold 16px Arial',
      fill: '#000000',
      wordWrap: false,
      align: 'left'
    };

    this.interfaceStyles = {
      font: 'bold 24px Arial',
      fill: '#F5F5F5',
      wordWrap: false,
      align: 'left'
    };

    this.penaltyStyles = {
      font: 'bold 24px Arial',
      fill: '#ff5855',
      wordWrap: false,
      align: 'left'
    };

    this.progress = {
      tint: {
        full: '0x97d143',
        almost: '0xfff855',
        little: '0xffab55',
        none: '0xff5855'
      }
    };

    this.tint = {
      default: '0xffffff',
      disabled: '0xB3B3B3',
      debt: '0xff5855'
    };

    this.properities = {
      padding: 30,
      state: 'idle'
    };

    this.interface = null;
    this.actions = null;
    this.timer = null;
    this.cash = null;
    this.volume = null;
    this.music = null;
  }

  init() {
    // define game & create interface
    this.game = window.game;
    this.upgradeSound = this.game.add.audio('upgrade');
  }

  createInterface() {
    this.interface = this.game.add.group();

    // draw cash info
    var wallet = this.game.add.sprite(25, 5, 'wallet');
    wallet.width = 45;
    wallet.height = 45;

    this.cash = this.game.add.text(85, 15, '0 zł', this.interfaceStyles);
    this.cash.stroke = '#000000';
    this.cash.strokeThickness = 6;

    // draw time info
    var clock = this.game.add.sprite(this.game.width - 65, 10, 'timer');
    clock.width = 40;
    clock.height = 40;

    this.timer = this.game.add.text(this.game.width - clock.width - 100, 15, '00:00', this.interfaceStyles);
    this.timer.stroke = '#000000';
    this.timer.strokeThickness = 6;

    // draw music button
    this.music = this.game.add.sprite(this.game.width - 210, 20, 'music_on');
    this.music.inputEnabled = true;
    this.music.input.useHandCursor = true;
    this.music.height = 25;
    this.music.width = 25;
    this.music.events.onInputDown.add(this.toggleMusic, this);

    // draw sound button
    this.volume = this.game.add.sprite(this.game.width - 175, 20, 'volume_on');
    this.volume.inputEnabled = true;
    this.volume.input.useHandCursor = true;
    this.volume.height = 25;
    this.volume.width = 25;
    this.volume.events.onInputDown.add(this.toggleVolume, this);

    // add to interface
    this.interface.add(clock);
    this.interface.add(wallet);
    this.interface.add(this.cash);
    this.interface.add(this.timer);
    this.interface.add(this.volume);
    this.interface.add(this.music);
    this.interface.fixedToCamera = true;
  }

  updateInterface() {
    // update timer
    var time = Math.round(this.game.time.now / 1000);
    this.timer.setText(this.formatTime(time));

    // update cash
    this.cash.setText(Owner.cash + ' zł');

    if(Owner.cash < 0) {
      this.cash.tint = this.tint.debt;
    } else {
      this.cash.tint = this.tint.default;
    }
  }

  showActions(obj, position, actions) {
    // if actions are visible, hide them, if not, create them
    var actionsVisible = Object.keys(actions).filter(function(a){ return actions[a].visible });

    if(this.properities.state == 'actions') {
      this.destroyActions();
    } else if(actionsVisible.length){
      this.properities.state = 'actions';
      this.createActions(obj, position, actions);
    }
  }

  createActions(obj, position, actions) {
    // create action pointer and adjust its position
    this.actions = this.game.add.sprite(position.x, position.y, 'action_line');
    this.content = this.actions.addChild(this.game.add.sprite(0, 0));
    this.actions.y -= this.actions.height + 15;

    // for every action, create action button
    for(var a in actions) {
      if(actions.hasOwnProperty(a)) {
        var action = actions[a];
        var x = 0;
        var y = 0;

        switch(action.position) {
          case 'left':
          x -= 25;
          y += 35;
          break;

          case 'right':
          x += 50;
          y += 35;
          break;

          case 'top':
          x += 18;
          y -= 20;
          break;
        }

        if(action.visible) {
          var cta =  this.content.addChild(this.game.add.sprite(x, y, action.icon));
          cta.anchor.set(0.5);
          cta.width = 50;
          cta.height = 50;

          if(action.enabled) {
            cta.inputEnabled = true;
            cta.input.useHandCursor = true;
            cta.input.priorityID = 2;
            cta.events.onInputOver.add(this.actionOver, {cta: cta, action: action, gui: this});
            cta.events.onInputOut.add(this.actionOut, {cta: cta, action: action, gui: this});
            cta.events.onInputDown.add(this.actionDown, {cta: cta, action: action, gui: this, object: obj});
          } else {
            cta.tint = this.tint.disabled;
          }
        }
      }
    }
  }

  destroyActions() {
    // if actions exist, destroy them
    if(this.actions) {
      this.actions.destroy();
      this.actions = null;
      this.properities.state = 'idle';
    }
  }

  actionOver() {
    // scale out action button
    this.cta.scale.setTo(0.6, 0.6);
  }

  actionOut() {
    // scale in action button
    this.cta.scale.setTo(0.5, 0.5);
  }

  actionDown() {
    // on click call action callback
    this.action.callback(this.object);

    this.gui.destroyActions();
  }

  showCost(cost, income, position) {
    var styles = {
      font: 'bold 16px Arial',
      fill: '#FF0040',
      wordWrap: false,
      align: 'left'
    };

    if(income) {
      styles.fill = '#B3FF00';
      cost = '+ ' + cost + 'zł';
    } else {
      styles.fill = '#FF0040';
      cost = '- ' + cost + 'zł';
    }

    var text = this.game.add.text(position.x, position.y, cost, styles);
    text.anchor.setTo(0.5);
    this.game.add.tween(text).to( { y: position.y - 100, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
  }

  showPenalty(penalty) {
    penalty = '-' + penalty + 'zł';
    var text = this.game.add.text(85, 15, penalty, this.penaltyStyles);
    this.game.add.tween(text).to( { y: 65, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
  }

  showWarning(position, image) {
    var warning = this.game.add.sprite(position.x, position.y - 25, image, 0);
    warning.anchor.setTo(0.5);
    this.game.add.tween(warning.scale).to( { x: 1.5, y: 1.5 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    return warning;
  }

  hideWarning(warning) {
    warning.destroy();
  }

  showUpgradeOptions(obj) {
    // draw options background
    var popup = this.game.add.graphics(this.game.width / 2 - 250, this.game.height / 2 - 125);
    popup.alpha = 0;
    popup.beginFill(0xFFFFFF, 0.9);
    popup.lineStyle(2, 0x000000, 1);
    popup.drawRect(0, 0, 500, 250);
    popup.endFill();
    popup.inputEnabled = true;
    popup.input.priorityID = 4;
    popup.fixedToCamera = true;

    // fade in game over screen
    this.game.add.tween(popup).to( { alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);

    var i = 25;

    for(var u in obj.upgrades) {
      if(obj.upgrades.hasOwnProperty(u)) {
        var upgrade = obj.upgrades[u];

        var row = popup.addChild(this.game.add.sprite(25, i));
        var title = row.addChild(this.game.add.text(0, 0, upgrade.title, this.heading));
        var desc = row.addChild(this.game.add.text(0, 25, upgrade.description, this.styles));
        var button = row.addChild(this.game.add.sprite(popup.width - 150, 25, 'upgrade_button'));
        button.anchor.setTo(0.5, 0.5);
        button.scale.setTo(0.4, 0.4);
        button.id = u;

        if(upgrade.enabled && !upgrade.active) {
          button.inputEnabled = true;
          button.input.priorityID = 5;
          button.input.useHandCursor = true;
        }

        if(upgrade.active) {
          button.tint = this.progress.tint.full;
        } else {
          button.tint = button.inputEnabled ? this.tint.default: this.tint.disabled;
        }

        button.events.onInputDown.add(function(event) {
          this.upgradeSound.play();

          obj.upgrade(event.id);

          var scaleUp = this.game.add.tween(event.scale).to( { x: 0.7, y: 0.7 }, 250, Phaser.Easing.Bounce.InOut);
          var scaleDown = this.game.add.tween(event.scale).to( { x: 0.4, y: 0.4 }, 250, Phaser.Easing.Bounce.InOut);

          scaleUp.chain(scaleDown);
          scaleUp.start();

          scaleDown.onComplete.add(function() {
            event.tint = this.progress.tint.full;
          }, this);

          event.inputEnabled = false;
        }, this);

        var close = popup.addChild(this.game.add.sprite(popup.width - 55, 5, 'close', 0));
        close.width = 50;
        close.height = 50;
        close.inputEnabled = true;
        close.input.priorityID = 5;
        close.input.useHandCursor = true;
        close.events.onInputDown.add(function() {
          this.hideUpgradeOptions(popup);
        }, this);

        i+= 75;
      }
    }
  }

  hideUpgradeOptions(popup) {
    popup.destroy();
  }

  formatTime(s) {
    // format time to 00:00
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
  }

  toggleMusic() {
    // toggle game sound
    Simulator.music.mute = Simulator.music.mute ? false : true;

    // toggle volume button texture
    if(Simulator.music.mute) {
      this.music.loadTexture('music_off', 0, false);
    } else {
      this.music.loadTexture('music_on', 0, false);
    }
  }

  toggleVolume() {
    // toggle game sound
    this.game.sound.mute = this.game.sound.mute ? false : true;
    Simulator.music.mute = this.game.sound.mute ? true : false;

    // toggle volume button texture
    if(this.game.sound.mute) {
      this.volume.loadTexture('volume_off', 0, false);
      this.music.loadTexture('music_off', 0, false);
    } else {
      this.volume.loadTexture('volume_on', 0, false);
      this.music.loadTexture('music_on', 0, false);
    }
  }
}

export default new Gui();
