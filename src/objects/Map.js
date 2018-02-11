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

    this.renderMap();
  }

  renderMap() {
    //tiles groups
    var tile, offset;

    // draw background
    this.background = this.game.add.sprite(0, 0, 'background', 0, this.groundGroup);
    this.background.tint = '0xb5dd6f';

    // draw map with zig zag method
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
