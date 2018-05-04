import Boot from 'states/Boot';
import Load from 'states/Load';
import Menu from 'states/Menu';
import Level from 'states/Level';

class Game extends Phaser.Game {
	constructor() {
		// create phaser game
		super(1920, 960, Phaser.CANVAS, 'game');

		// add all states
		this.state.add('Boot', Boot, false);
		this.state.add('Load', Load, false);
		this.state.add('Menu', Menu, false);
		this.state.add('Level', Level, false);

		// game level
		this.year = 1;

		// game's seasons
		this.seasons = ['wiosna', 'lato', 'jesień', 'zima'];
		this.season = this.seasons[0];

		// game level condition
		this.seasonConditions = {
			'wiosna' : {
				allIncubated: false,
				allInCages: false,
				foodStorageFull: false,
				timesUp: true
			},
			'lato' : {
				timesUp: false
			},
			'jesień' : {
				timesUp: false
			},
			'zima' : {
				timesUp: false
			}
		};

		this.seasonDuration = {
			'wiosna' : {
				minutes: 1,
				seconds: 30
			},
			'lato' : {
				minutes: 1,
				seconds: 30
			},
			'jesień' : {
				minutes: 1,
				seconds: 30
			},
			'zima' : {
				minutes: 1,
				seconds: 30
			}
		};

		// game's tools mode
		this.toolsMode = 'default';
		this.cursor = {
			default: 'pointer',
			hand: "url('/assets/img/gui/cursor_grab.png'), auto",
			grab: "url('/assets/img/gui/cursor_grabbing.png'), auto",
			clean: "url('/assets/img/gui/cursor_clean.png'), auto",
			heal: "url('/assets/img/gui/cursor_med.png'), auto",
			electric: "url('/assets/img/gui/cursor_electric.png'), auto"
		};
		this.currentCursor = this.cursor.default;

		// game's tutorial
		this.tutorialEnabled = false;

		// start booting state
		this.state.start('Boot');
	}
}

window.game = new Game();
