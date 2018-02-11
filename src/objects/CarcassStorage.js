/*
 * Carcass Storage Class
 * Storage properties and methods
*/
import Prefab from 'objects/Prefab';
import Farm from 'objects/Farm';
import Owner from 'objects/Owner';
import Gui from 'objects/Gui';
import Stats from 'objects/Stats';
import Alert from 'objects/Alert';

class CarcassStorage extends Prefab {
	constructor(game, x, y, image, frame, group) {
		super(game, x, y, image, frame, group);

		this.game = game;

		this.attributes = {
			carcass: {
				max: 100,
				min: 0,
				current: 0,
				label: 'Tusze',
				icon: 'kill_stock_icon',
				increase: 2
			}
		};

		this.actions = {
			utilization: {
				label: 'Utylizacja',
				icon: 'action_waste_icon',
				position: 'top',
				enabled: false,
				visible: true,
				callback: this.utilize,
				price: 5,
				income: false,
				sound: this.game.add.audio('garbage')
			},
			recycle: {
				label: 'Przerobienie na karmę',
				icon: 'action_recycle_icon',
				position: 'left',
				enabled: false,
				visible: true,
				callback: this.recycle,
				price: 2,
				income: false,
				sound: this.game.add.audio('garbage')
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
				desc: 'Zabij 100 zwierząt.',
				newMax: 150,
				enabled: false,
				active: false,
				price: 1000,
				condition: 100
			},
			{
				title: 'Średnio większa pojemność (5000zł)',
				desc: 'Zabij 250 zwierząt.',
				newMax: 200,
				enabled: false,
				active: false,
				price: 5000,
				condition: 250
			},
			{
				title: 'Znacznie większa pojemność (7500zł)',
				desc: 'Zabij 500 zwierząt.',
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
			carcass: 0,
			recycled: 0
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

	stackCarcass() {
		// increase amount of carcass in storage
		if(this.attributes.carcass.current + this.attributes.carcass.increase >= this.attributes.carcass.max) {
			this.attributes.carcass.current = this.attributes.carcass.max;
			// change state to full
			CarcassStorage.full = true;

			// show alert
			if(!this.alert) {
				this.alert = new Alert(this.game, this.position.x, this.position.y, this);
			}
		} else {
			this.attributes.carcass.current += this.attributes.carcass.increase;
		}

		// enable utilize action
		this.actions.utilization.enabled = true;
		this.actions.recycle.enabled = true;
	}

	utilize(o) {
		// increase amount of utilized carcass
		o.stats.carcass += o.attributes.carcass.current;

		// decrease owner cash
		var cost = o.attributes.carcass.current * o.actions.utilization.price;
		Owner.cash -= cost;
		Gui.showCost(cost, o.actions.utilization.income, o.position);

		// decrease amount of carcass
		o.attributes.carcass.current = o.attributes.carcass.min;

		// disable action utilize & recycle
		o.actions.utilization.enabled = false;
		o.actions.recycle.enabled = false;

		// play sound
		o.actions.utilization.sound.play();

		// change state to empty
		CarcassStorage.full = false;

		// hide alert
		if(o.alert) {
			o.alert.hideAlert();
		}
	}

	recycle(o) {
		// increase amount of utilized carcass & times it was recycled
		o.stats.carcass += o.attributes.carcass.current;
		o.stats.recycled ++;

		// decrease owner cash
		var cost = o.attributes.carcass.current * o.actions.recycle.price;
		Owner.cash -= cost;
		Gui.showCost(cost, o.actions.recycle.income, o.position);

		// decrease food in food storage
		Farm.foodStorage.addFood(o.attributes.carcass.current);

		// decrease amount of carcass
		o.attributes.carcass.current = o.attributes.carcass.min;

		// disable action utilize & recycle
		o.actions.utilization.enabled = false;
		o.actions.recycle.enabled = false;

		// play sound
		o.actions.recycle.sound.play();

		// change state to empty
		CarcassStorage.full = false;

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
				upgrade.description = upgrade.desc + ' (' + Farm.killed + '/' + upgrade.condition  + ')';

				if(upgrade.condition <= Farm.killed && Owner.cash >= upgrade.price) {
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
		this.attributes.carcass.max = upgrade.newMax;
		this.state.full = false;

		// hide alert
		if(this.alert) {
			this.alert.hideAlert();
		}
	}
}

export default CarcassStorage;
