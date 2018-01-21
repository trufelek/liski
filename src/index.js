import Boot from 'states/Boot';
import Load from 'states/Load';
import Menu from 'states/Menu';
import Level1 from 'states/Level1';

class Game extends Phaser.Game {
	constructor() {
		// create phaser game
		super(1080, 600, Phaser.CANVAS, 'game');

		// add all states
		this.state.add('Boot', Boot, false);
		this.state.add('Load', Load, false);
		this.state.add('Menu', Menu, false);
		this.state.add('Level1', Level1, false);

		// start booting state
		this.state.start('Boot');
	}
}

window.game = new Game();
