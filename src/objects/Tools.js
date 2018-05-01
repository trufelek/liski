/*
 * Tools Class
 * Tools tools methods and properties
*/
import Prefab from 'objects/Prefab';

class Tools extends Prefab {
  constructor(game, x, y, image, frame, tools, cursor, group) {
    super(game, x, y, image, frame, group);

    this.game = game;
    this.glowTexture = image + '_glow';
    this.tools = tools;
    this.cursor = cursor;

    this.init();
  }

  init() {
    // add object to game
    this.game.add.existing(this);

    if(this.tools == 'electricity') {
      this.width = 100;
      this.height = 100;
    }
  }

  click() {
    if(this.game.toolsMode == this.tools) {
      this.game.toolsMode = 'default';
      this.game.canvas.style.cursor = this.game.cursor.default;
      this.game.currentCursor = this.game.cursor.default;
    } else {
      this.game.toolsMode = this.tools;
      this.game.canvas.style.cursor = this.cursor;
      this.game.currentCursor = this.cursor;
    }
  }
}

export default Tools;
