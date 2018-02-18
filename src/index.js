import Boot from 'states/Boot';
import Load from 'states/Load';
import Menu from 'states/Menu';
import Level from 'states/Level';

class Game extends Phaser.Game {
	constructor() {
		// create phaser game
		super(1080, 600, Phaser.CANVAS, 'game');

		// add all states
		this.state.add('Boot', Boot, false);
		this.state.add('Load', Load, false);
		this.state.add('Menu', Menu, false);
		this.state.add('Level', Level, false);

		// game's seasons
		this.seasons = ['wiosna', 'lato', 'jesień', 'zima'];
		this.season = this.seasons[0];

		// game level
		this.year = 1;

		// game level condition
		this.conditions = {
			'wiosna' : {
				allIncubated: false,
				allInCages: false,
				foodStorageFull: false
			},
			'lato' : {
				allCleaned: false
			},
			'jesień' : {
				allIncubated: false
			},
			'zima' : {
				allKilled: false,
				allFurSold: false
			}
		};

		// game's tutorial
		this.tutorialEnabled = false;

		// start booting state
		this.state.start('Boot');
	}
}

window.game = new Game();
