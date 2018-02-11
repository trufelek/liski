/*
  * Load State
  * Load assets and render loader bar screen
*/
import Simulator from 'objects/Simulator';

class Load extends Phaser.State {
  init() {
    console.log('Loading...');
  }

  preload() {
    // show load screen
    this.loaderText = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 25, 'loader_text');
    this.loaderText.anchor.setTo(0.5);

    this.loaderBar = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loader');
    this.loaderBar.x = this.game.world.centerX - 200;

    this.game.load.setPreloadSprite(this.loaderBar);
    this.game.load.onLoadComplete.add(this.loadComplete, this);

    //load assets
    for(var asset_key in Simulator.assets) {
      if(Simulator.assets.hasOwnProperty(asset_key)) {
        var asset = Simulator.assets[asset_key];

        switch(asset.type) {
          case 'image':
          this.game.load.image(asset_key, asset.path);
          break;

          case 'sound':
          this.game.load.audio(asset_key, asset.path);
          break;
        }
      }
    }
  }

  loadComplete() {
    this.game.state.start("Menu");
  }
}

export default Load;
