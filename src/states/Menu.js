/*
 * Menu State
 * Render main menu screen
*/
class Menu extends Phaser.State {
  init() {
    console.log('Menu screen...');
  }

  create() {
    // show home screen
    this.home = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 100, 'home');
    this.home.anchor.setTo(0.5);

    // start button
    this.start = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 75, 'start');
    this.start.anchor.setTo(0.5);
    this.start.inputEnabled = true;
    this.start.input.useHandCursor = true;

    // start button interactions
    this.start.events.onInputOver.add(function() {
      this.start.loadTexture('start_hover', 0, false);
    }, this);

    this.start.events.onInputOut.add(function() {
      this.start.loadTexture('start', 0, false);
    }, this);

    // start game on click
    this.start.events.onInputDown.add(this.startGame, this);
  }

  startGame() {
    this.game.state.start("Level");
  }
}

export default Menu;
