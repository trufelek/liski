/*
 * Farm Class
 * Stores farm stats and objects
*/

class Farm {
    constructor() {
      this.cages = [];
      this.incubators = [];
      this.pavilions = [];
      this.skinningStations = [];
      this.killingStations = [];
      this.slaughterhouse = null;
      this.foodStorage = null;
      this.furStorage = null;
      this.carcassStorage = null;
      this.office = null;
      this.incubated = 0;
      this.killed = 0;
      this.skinned = 0;
    }
}

export default new Farm();
