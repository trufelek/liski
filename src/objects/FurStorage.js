/*
 * Fur Storage Class
 * Storage properties and methods
*/
import Prefab from 'objects/Prefab';
import Farm from 'objects/Farm';
import Owner from 'objects/Owner';
import Gui from 'objects/Gui';
import Stats from 'objects/Stats';
import Alert from 'objects/Alert';

class FurStorage extends Prefab {
    constructor(game, x, y, image, frame, group) {
      super(game, x, y, image, frame, group);

      this.game = game;

      this.attributes = {
        fur: {
            max: 100,
            min: 0,
            current: 0,
            label: 'Futro',
            icon: 'fur_icon',
            increase: 2,
            level: 0,
            visible: true
        }
	    };

	    this.actions = {
	        sell: {
	            label: 'Sprzedaż',
	            icon: 'action_sell_icon',
	            position: 'top',
	            enabled: false,
	            callback: this.sell,
	            visible: true,
	            price: 10,
	            income: true,
	            sound: game.add.audio('selling')
	        },
	        upgrade: {
	            label: 'Upgrade',
	            icon: 'action_upgrade_icon',
	            position: 'right',
	            enabled: true,
	            visible: true,
	            callback: this.chooseUpgrade
	        }
	    };

	    this.upgrades = [
	        {
	            title: 'Trochę większa pojemność (1000zł)',
	            desc: 'Oskóruj 100 zwierząt.',
	            newMax: 150,
	            enabled: false,
	            active: false,
	            price: 1000,
	            condition: 100
	        },
	        {
	            title: 'Średnio większa pojemność (5000zł)',
	            desc: 'Oskóruj 250 zwierząt.',
	            newMax: 200,
	            enabled: false,
	            active: false,
	            price: 5000,
	            condition: 250
	        },
	        {
	            title: 'Znacznie większa pojemność (7500zł)',
	            desc: 'Oskóruj 500 zwierząt.',
	            newMax: 300,
	            enabled: false,
	            active: false,
	            price: 7500,
	            condition: 500
	        }
	    ];

	    this.state = {
	        full: false
	    };

	    this.stats = {
	        fur: 0
	    };

	    this.alert = null;
	    this.statsBar = null;

	    this.init();
    }

    init() {
	    // add object to game
	    this.game.add.existing(this);

	    // create stats
	    this.statsBar = new Stats(this.game, this.position.x, this.position.y, this, false, true);
	}

	stack(stack) {
	    // increase fur amount
	    this.stackFur(stack);
	}

	stackFur() {
	    // increase amount of fur in storage
	    if(this.attributes.fur.current + this.attributes.fur.increase >= this.attributes.fur.max) {
	        this.attributes.fur.current = this.attributes.fur.max;
	        // change state to full
	        this.state.full = true;

	        // show alert
	        if(!this.alert) {
	            this.alert = new Alert(this.game, this.position.x, this.position.y, this);
	        }
	    } else {
	        this.attributes.fur.current += this.attributes.fur.increase;
	    }

	    // enable sell action
	    this.actions.sell.enabled = true;
	}

	sell(o) {
	    // increase amount of sold fur
	    o.stats.fur += o.attributes.fur.current;

	    // decrease owner cash
	    var income = o.attributes.fur.current * o.actions.sell.price;
	    Owner.cash += income;
	    Gui.showCost(income, o.actions.sell.income, o.position);

	    // decrease amount of fur
	    o.attributes.fur.current = o.attributes.fur.min;

	    // disable action sell
	    o.actions.sell.enabled = false;

	    // play sound
	    o.actions.sell.sound.play();

	    // change state to empty
	    o.state.full = false;

	    // hide alert
	    if(o.alert) {
	        o.alert.hideAlert();
	    }
	}

	chooseUpgrade(o) {
	    // update upgrades
	    for(var u in o.upgrades) {
	        if(o.upgrades.hasOwnProperty(u)) {
	            var upgrade = o.upgrades[u];
	            upgrade.description = upgrade.desc + ' (' + Farm.skinned + '/' + upgrade.condition  + ')';

	            if(upgrade.condition <= Farm.skinned && Owner.cash >= upgrade.price) {
	                if(u == 0 || o.upgrades[u - 1].active) {
	                    upgrade.enabled = true;
	                }
	            } else {
	                upgrade.enabled = false;
	            }
	        }
	    }

	    // show upgrade options
	    Gui.showUpgradeOptions(o);
	}

	upgrade(u) {
	    // update upgrade
	    var upgrade = this.upgrades[u];
	    upgrade.active = true;
	    upgrade.enabled = false;

	    // decrease owner cash by upgrade price
	    Owner.cash -= upgrade.price;
	    Gui.showCost(upgrade.price, false, this.position);

	    // upgrade carcass storage
	    this.attributes.fur.max = upgrade.newMax;
      this.state.full = false;

	    // hide alert
	    if(this.alert) {
	        this.alert.hideAlert();
	    }
	}
}

export default FurStorage;
