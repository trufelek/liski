/*
 * Map Class
 * Renders map
*/
import Simulator from 'objects/Simulator';
import Farm from 'objects/Farm';
import Cage from 'objects/Cage';
import Incubator from 'objects/Incubator';
import Pavilion from 'objects/Pavilion';
import Slaughterhouse from 'objects/Slaughterhouse';
import FurStorage from 'objects/FurStorage';
import CarcassStorage from 'objects/CarcassStorage';
import FoodStorage from 'objects/FoodStorage';
import KillingStation from 'objects/KillingStation';
import SkinningStation from 'objects/SkinningStation';

class Map {
  constructor() {}

  init() {
    // game settings
    this.game = window.game;
    this.game.world.setBounds(0, 0, Simulator.settings.width, Simulator.settings.height);

    // set sprites groups
    this.groundGroup = this.game.add.group();
    this.foodStorageGroup = this.game.add.group();
    this.incubatorGroup = this.game.add.group();
    this.pavilionGroup = this.game.add.group();
    this.cageGroup = this.game.add.group();
    this.slaughterhouseGroup = this.game.add.group();
    this.carcassStorageGroup = this.game.add.group();
    this.furStorageGroup = this.game.add.group();
    this.foregroundGroup = this.game.add.group();

    this.renderMap();
  }

  renderMap() {
    //tiles groups
    var tile, offset;

    // draw background
    this.background = this.game.add.sprite(0, 0, 'background', 0, this.groundGroup);

    // add cages & pavilions
    this.drawPavilions();

    // add incubators
    this.drawIncubators();

    // add food FurStorage
    Farm.foodStorage = new FoodStorage(this.game, 910, 545, 'karma_back', 0, this.foodStorageGroup);
    Farm.foodStorage.anchor.set(0.5);

    // draw foreground
    this.foreground = this.game.add.sprite(0, 0, 'foreground', 0, this.foregroundGroup);
    this.game.world.bringToTop(this.foregroundGroup);
  }

  drawIncubators() {
    var incubator1 = this.drawIncubator(140, 380, 'b')
    var incubator2 = this.drawIncubator(240, 445, 'a')
    var incubator3 = this.drawIncubator(420, 420, 'a')
    var incubator4 = this.drawIncubator(540, 490, 'a')
    var incubator5 = this.drawIncubator(140, 490, 'a')
    var incubator6 = this.drawIncubator(340, 515, 'b')
    var incubator7 = this.drawIncubator(465, 540, 'a')
    var incubator8 = this.drawIncubator(340, 600, 'a')
    var incubator9 = this.drawIncubator(625, 565, 'b')
  }

  drawIncubator(x, y, type) {
    var shadow = this.game.add.sprite(x, y, 'inku_cien_' + type, 0, this.groundGroup);
    var incubator = new Incubator(this.game, x, y, 'inku_empty_' + type, 0, this.incubatorGroup, type);
    Farm.incubators.push(incubator);
    incubator.anchor.set(0.5);
    shadow.anchor.set(0.5);
  }

  drawPavilions() {
    // draw pavilions
    var pavilion1 = this.drawPavilion(170, -10);
    var pavilion2 = this.drawPavilion(475, -15);
    var pavilion3 = this.drawPavilion(725, 5);
    var pavilion4 = this.drawPavilion(1025, 5);
    var pavilion5 = this.drawPavilion(1150, 75);
    var pavilion5 = this.drawPavilion(1300, 145);
  }

  drawPavilion(x, y) {
    var pavilion = new Pavilion(this.game, x, y, 'paw_cien', 0, this.pavilionGroup);

    // pavilion bottom
    pavilion.addChild(this.game.add.sprite(0, 0, 'paw_tyl_spod', 0, this.pavilionGroup));
    pavilion.addChild(this.game.add.sprite(0, 0, 'paw_srodek_spod', 0, this.pavilionGroup));
    pavilion.addChild(this.game.add.sprite(0, 0, 'paw_przod_spod', 0, this.pavilionGroup));

    // pavilion cages
    var cageA = new Cage(this.game, 479, 156.5, 'paw_klatki_puste', 0, this.cageGroup, 0, pavilion, 'tyl');
    pavilion.addChild(cageA);
    Farm.cages.push(cageA);
    cageA.anchor.set(0.5, 0.5);

    var cageB = new Cage(this.game, 337, 228, 'paw_klatki_puste', 0, this.cageGroup, 0, pavilion, 'srodek');
    pavilion.addChild(cageB);
    Farm.cages.push(cageB);
    cageB.anchor.set(0.5, 0.5);

    var cageC = new Cage(this.game, 192, 298.5, 'paw_klatki_puste', 0, this.cageGroup, 0, pavilion, 'przod');
    pavilion.addChild(cageC);
    Farm.cages.push(cageC);
    cageC.anchor.set(0.5, 0.5);

    // pavilion front & top
    pavilion.front = pavilion.addChild(this.game.add.sprite(0, 0, 'paw_przod_front', 0, this.pavilionGroup));
    pavilion.roof = pavilion.addChild(this.game.add.sprite(0, 0, 'paw_dach', 0, this.pavilionGroup));

    pavilion.init();

    Farm.pavilions.push(pavilion);

    return pavilion;
  }

  switchTextures(season) {
    switch (season) {
      case 'wiosna':
        this.background.tint = '0xb5dd6f';
        break;
      case 'lato':
        this.background.tint = '0x76c544';
        break;
      case 'jesień':
        this.background.tint = '0xd68c5a';
        break;
      case 'zima':
        this.background.tint = '0xffffff';
        break;
    }
  }
}

export default new Map();
