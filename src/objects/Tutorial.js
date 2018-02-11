/*
 * Tutorial Class
 * Shows player tips and info about game and objects
*/
class Tutorial {
    constructor() {
      this.titleStyles = {
          font: 'bold 18px Arial',
          fill: '#000000',
          wordWrap: false,
          align: 'center'
      };

      this.messageStyles = {
          font: 'bold 16px Arial',
          fill: '#000000',
          wordWrap: true,
          wordWrapWidth: 400,
          align: 'center'
      };

      this.mask = null;
      this.popup = null;

      this.init();
    }

    init() {
      this.game = window.game;

      // display masks
      this.mask = this.game.add.graphics(0,0);
      this.mask.alpha = 0;
      this.mask.beginFill(0x000000, 1);
      this.mask.drawRect(0, 0, this.game.width, this.game.height);
      this.mask.endFill();
      this.mask.inputEnabled = true;
      this.mask.input.priorityID = 4;
      this.mask.fixedToCamera = true;

      // display popup
      this.popup = this.game.add.graphics(this.game.width / 2 - 250, this.game.height / 2 - 125);
      this.popup.beginFill(0xFFFFFF, 0.9);
      this.popup.lineStyle(2, 0x000000, 1);
      this.popup.drawRect(0, 0, 500, 250);
      this.popup.endFill();
      this.popup.inputEnabled = true;
      this.popup.input.priorityID = 4;
      this.popup.fixedToCamera = true;

      // display event message
      var text = this.popup.addChild(this.game.add.text(this.popup.width / 2, 100, 'To twój pierwszy dzień na fermie futrzarskiej? Skorzystaj z samouczka aby poznać dostępne funkcje i obiekty.', this.messageStyles));
      text.anchor.setTo(0.5);

      // start button
      var buttonStart = this.popup.addChild(this.game.add.graphics(100, 165));
      buttonStart.beginFill(0xd3e655, 1);
      buttonStart.drawRect(0, 0, 100, 40)
      buttonStart.inputEnabled = true;
      buttonStart.input.useHandCursor = true;
      buttonStart.input.priorityID = 5;

      var buttonStartText = buttonStart.addChild(this.game.add.text(buttonStart.width / 2, 22, 'START', this.messageStyles));
      buttonStartText.anchor.setTo(0.5);

      // skip button
      var buttonSkip = this.popup.addChild(this.game.add.graphics(this.popup.width - 200, 165));
      buttonSkip.beginFill(0xec6a6c, 1);
      buttonSkip.drawRect(0, 0, 100, 40)
      buttonSkip.inputEnabled = true;
      buttonSkip.input.useHandCursor = true;
      buttonSkip.input.priorityID = 5;

      var buttonSkipText = buttonSkip.addChild(this.game.add.text(buttonSkip.width / 2, 22, 'POMIŃ', this.messageStyles));
      buttonSkipText.anchor.setTo(0.5);

      // start button action
      buttonStart.events.onInputDown.add(function() {
        this.hidePopup();
      }, this);

      // skip button action
      buttonSkip.events.onInputDown.add(function() {
        this.game.tutorialEnabled = false;
        this.hidePopup();
      }, this);
    }

    hidePopup() {
      this.game.add.tween(this.popup).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false).onComplete.add(function() {
        this.mask.destroy();
        this.popup.destroy();
      }, this);
    }
}

export default Tutorial;
