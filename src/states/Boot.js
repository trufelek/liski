/*
	* Boot State
	* Loads data and sets basic configuration
*/
import Simulator from 'objects/Simulator';

class Boot extends Phaser.State {
	init() {
		console.log('Booting...');
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.refresh();
		
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.input.maxPointers = 1;
	}

	preload() {
		// preload images
		this.game.load.image('loader_text', 'assets/img/loader_text.png');
		this.game.load.image('loader', 'assets/img/loader.png');

		// load json settings
		this.load.text('data', 'assets/data/data.json');

		// load json map
		this.load.text('map', 'assets/data/map.json');
	}

	create() {
		// save json data content
		var text = this.game.cache.getText('data');
		var map = this.game.cache.getText('map');

		Simulator.data = JSON.parse(text);
		Simulator.map = JSON.parse(map).map;
		Simulator.assets = Simulator.data.assets;
		Simulator.settings = Simulator.data.settings;

		// start loading state
		this.game.state.start("Load");
	}
}

export default Boot;
