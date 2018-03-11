/*
	* Boot State
	* Loads data and sets basic configuration
*/
import Simulator from 'objects/Simulator';

class Boot extends Phaser.State {
	init() {
		console.log('Booting...');
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.input.maxPointers = 1;
		this.game.canvas.style.cursor = 'pointer';
	}

	preload() {
		// preload images
		this.game.load.image('loader_text', 'assets/img/loader_text.png');
		this.game.load.image('loader', 'assets/img/loader.png');

		// load json settings
		this.load.text('data', 'assets/data/data.json');
	}

	create() {
		// save json data content
		var text = this.game.cache.getText('data');
		Simulator.data = JSON.parse(text);
		Simulator.assets = Simulator.data.assets;
		Simulator.settings = Simulator.data.settings;

		// start loading state
		this.game.state.start("Load");
	}
}

export default Boot;
