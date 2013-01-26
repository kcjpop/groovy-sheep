Crafty.c('Map', {
	/**
	 * Store map data
	 * @type {Array}
	 */
	map : [],
	init: function() {
		this.addComponent('2D, Canvas, Color');
		
		this._create(3, 3);
	},
	/**
	 * Get the name of entity
	 * @return {string} Entity's name
	 */
	toString: function() {
		return 'Map';
	},
	/**
	 * Create a new map
	 * @param  {int} bush Number of bushes
	 * @param  {int} tree Number of trees
	 * @return {array}      A 2-dimentional array representing the map
	 */
	_create: function(bush, tree) {
		if(this.map.length !== 0) {
			console.log('map created');
			return;
		}
		// As we are targeting iPad resolution (1024 x 768) with 64-pixel block
		// Our map will have 1024 / 64 = 16 columns and 768 / 64 = 12 rows
		// 0 will be used to denoted empty blocks, 1 is for bush and 2 is for tree

		var i, j, randomX, randomY,
			cols = Crafty.viewport.width / 64,
			rows = Crafty.viewport.height / 64,
			tmp = [
				[bush, 1],
				[tree, 2]
			];

		// Create empty map
		for(i = 0; i < rows; i++) {
			if(!(this.map[i] instanceof Array)) {
				this.map[i] = [];
			}

			for(j = 0; j < cols; j++) {
				this.map[i][j] = 0;
			}
		}

		// Randomly put trees and bushes
		for(i in tmp) {
			while(tmp[i][0] > 0) {
				randomX = Crafty.math.randomInt(0, rows - 1);
				randomY = Crafty.math.randomInt(0, cols - 1);
				if(this.map[randomX][randomY] === 0) {
					this.map[randomX][randomY] = tmp[i][1];
					tmp[i][0]--;
				}
			}
		}


		// this.map = [
		// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
		// 	[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		// ];
	}
});