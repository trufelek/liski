/*
 * Farm Class
 * Stores farm stats and objects
*/
import Owner from 'objects/Owner';

class Farm {
    constructor() {
    }
}

Farm.cages = [];
Farm.incubators = [];
Farm.pavilions = [];
Farm.skinningStations = [];
Farm.killingStations = [];
Farm.slaughterhouse = null;
Farm.foodStorage = null;
Farm.furStorage = null;
Farm.carcassStorage = null;
Farm.office = null;
Farm.incubated = 0;
Farm.killed = 0;
Farm.skinned = 0;

export default Farm;