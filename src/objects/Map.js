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
    this.background = this.game.add.sprite(0, 0, 'map_background', 0, this.groundGroup);
    //this.background.tint = '0xb5dd6f';

    // add cages & pavilions
    this.drawPavilions();

    // add incubators
    this.drawIncubators();

    // add food FurStorage
    Farm.foodStorage = new FoodStorage(this.game, 980, 512, 'karma_back', 0, this.foodStorageGroup);
    Farm.foodStorage.anchor.set(0.5);


    // draw foreground
    this.foreground = this.game.add.sprite(0, 0, 'foreground', 0, this.foregroundGroup);
    this.game.world.bringToTop(this.foregroundGroup);
  }

  drawIncubators() {
    var incubator = new Incubator(this.game, 140, 380, 'inkubator_b', 0, this.incubatorGroup, 'b');
    Farm.incubators.push(incubator);
    incubator.anchor.set(0.5);

    incubator = new Incubator(this.game, 240, 445, 'inkubator_a', 0, this.incubatorGroup, 'a');
    Farm.incubators.push(incubator);
    incubator.anchor.set(0.5);

    incubator = new Incubator(this.game, 420, 420, 'inkubator_a', 0, this.incubatorGroup, 'a');
    Farm.incubators.push(incubator);
    incubator.anchor.set(0.5);

    incubator = new Incubator(this.game, 540, 490, 'inkubator_a', 0, this.incubatorGroup, 'a');
    Farm.incubators.push(incubator);
    incubator.anchor.set(0.5);

    incubator = new Incubator(this.game, 140, 490, 'inkubator_a', 0, this.incubatorGroup, 'a');
    Farm.incubators.push(incubator);
    incubator.anchor.set(0.5);

    incubator = new Incubator(this.game, 340, 515, 'inkubator_b', 0, this.incubatorGroup, 'b');
    Farm.incubators.push(incubator);
    incubator.anchor.set(0.5);

    incubator = new Incubator(this.game, 465, 540, 'inkubator_a', 0, this.incubatorGroup, 'a');
    Farm.incubators.push(incubator);
    incubator.anchor.set(0.5);

    incubator = new Incubator(this.game, 340, 625, 'inkubator_a', 0, this.incubatorGroup, 'a');
    Farm.incubators.push(incubator);
    incubator.anchor.set(0.5);

    incubator = new Incubator(this.game, 625, 565, 'inkubator_b', 0, this.incubatorGroup, 'b');
    Farm.incubators.push(incubator);
    incubator.anchor.set(0.5);
  }

  drawPavilions() {
    // pavilion 1
    var cage = new Cage(this.game, 665, 140, 'pawilon_back_a', 0, this.cageGroup, 0, 1);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 522, 212, 'pawilon_modul_a', 0, this.cageGroup, 0, 1);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 379, 284, 'pawilon_front_a', 0, this.cageGroup, 0, 1);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    var pavilion = new Pavilion(this.game);
    Farm.pavilions.push(pavilion);

    // pavilion 2
    cage = new Cage(this.game, 965, 140, 'pawilon_back_a', 0, this.cageGroup, 0, 2);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 822, 212, 'pawilon_modul_a', 0, this.cageGroup, 0, 2);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 679, 284, 'pawilon_front_a', 0, this.cageGroup, 0, 2);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    pavilion = new Pavilion(this.game);
    Farm.pavilions.push(pavilion);

    // pavilion 3
    cage = new Cage(this.game, 1215, 165, 'pawilon_back_a', 0, this.cageGroup, 0, 3);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 1072, 237, 'pawilon_modul_a', 0, this.cageGroup, 0, 3);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 929, 309, 'pawilon_front_a', 0, this.cageGroup, 0, 3);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    pavilion = new Pavilion(this.game);
    Farm.pavilions.push(pavilion);

    // pavilion 4
    cage = new Cage(this.game, 1515, 165, 'pawilon_back_a', 0, this.cageGroup, 0, 4);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 1372, 237, 'pawilon_modul_a', 0, this.cageGroup, 0, 4);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 1229, 309, 'pawilon_front_a', 0, this.cageGroup, 0, 4);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    pavilion = new Pavilion(this.game);
    Farm.pavilions.push(pavilion);

    // pavilion 5
    cage = new Cage(this.game, 1655, 235, 'pawilon_back_a', 0, this.cageGroup, 0, 5);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 1512, 302, 'pawilon_modul_a', 0, this.cageGroup, 0, 5);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 1369, 374, 'pawilon_front_a', 0, this.cageGroup, 0, 5);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    pavilion = new Pavilion(this.game);
    Farm.pavilions.push(pavilion);

    // pavilion 6
    cage = new Cage(this.game, 1795, 295, 'pawilon_back_a', 0, this.cageGroup, 0, 6);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 1652, 367, 'pawilon_modul_a', 0, this.cageGroup, 0, 6);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    cage = new Cage(this.game, 1509, 440, 'pawilon_front_a', 0, this.cageGroup, 0, 6);
    Farm.cages.push(cage);
    cage.anchor.set(0.5, 0.5);

    pavilion = new Pavilion(this.game);
    Farm.pavilions.push(pavilion);
  }

  // TODO: delete after refactoring
  drawZigZagMap() {
    //draw map with zig zag method
    for(var i = 0; i < Simulator.map.length ; i++) {
      if(i % 2 == 0) {
        offset = Simulator.settings.tile.width / 2;
      } else {
        offset = 0;
      }

      for(var j = 0; j < Simulator.map[i].length; j++) {
        var x = (j * Simulator.settings.tile.width) + offset;
        var y = i * Simulator.settings.tile.height / 2;
        var index = Simulator.map[i][j];

        if(index == 1) {
          tile = new FoodStorage(this.game, x, y, 'food_storage', 0, this.foodStorageGroup);
          Farm.foodStorage = tile;
          tile.anchor.set(0.5);
        }

        if(index == 2) {
          tile = new Incubator(this.game, x, y, 'incubator', 0, this.incubatorGroup);
          Farm.incubators.push(tile);
          tile.anchor.set(0.5);
        }

        if(index >= 10 && index <= 31) {
          var type = index.toString().split('');
          var type_info = type.map(Number);
          var pavilion = type_info[0];
          var enabled = type_info[1];

          tile = new Cage(this.game, x, y, enabled ? 'cage_double_full' : 'cage_double_empty', 0, this.cageGroup, enabled, pavilion);
          Farm.cages.push(tile);
          tile.anchor.set(0.65, 0.4);
        }

        if(index == 3) {
          var pavilion_back = this.game.add.sprite(x, y, 'pavilion_back', 0, this.pavilionGroup);
          pavilion_back.anchor.set(0.25, 0.91);

          var pavilion_front = new Pavilion(this.game, x, y, 'pavilion_front', 0, this.pavilionGroup);
          Farm.pavilions.push(pavilion_front);
          pavilion_front.anchor.set(0.25, 0.91);
        }

        if(index == 4) {
          tile = this.game.add.sprite(x, y, 'box', 0);
          tile.anchor.set(0.5, 0);
        }

        if(index == 50) {
          var slaughterhouse_back = this.game.add.sprite(x, y, 'slaughterhouse_back', 0, this.slaughterhouseGroup);
          slaughterhouse_back.anchor.set(0, 0);
        }

        if(index == 5) {
          var slaughterhouse_front = new Slaughterhouse(this.game, x, y, 'slaughterhouse_front', 0, this.slaughterhouseGroup);
          Farm.slaughterhouse = slaughterhouse_front;
          slaughterhouse_front.anchor.set(1);
        }

        if(index == 6) {
          tile = new KillingStation(this.game, x, y, 'killing_robot', 0, this.slaughterhouseGroup);
          Farm.killingStations.push(tile);
          tile.anchor.set(0.5);
        }

        if(index == 7) {
          tile = new SkinningStation(this.game, x, y, 'skinning_robot', 0, this.slaughterhouseGroup);
          Farm.skinningStations.push(tile);
          tile.anchor.set(0.5);
        }

        if(index == 8) {
          var furStorage = new FurStorage(this.game, x, y, 'storage', 0, this.furStorageGroup);
          Farm.furStorage = furStorage;
          furStorage.anchor.set(0.5);
        }

        if(index == 81) {
          tile = this.game.add.sprite(x, y, 'furs', 0, this.furStorageGroup);
          tile.anchor.set(0.5);
        }

        if(index == 9) {
          var carcassStorage = new CarcassStorage(this.game, x, y, 'carcass', 0, this.carcassStorageGroup);
          Farm.carcassStorage = carcassStorage;
          carcassStorage.anchor.set(0.5);
        }
      }
    }
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
