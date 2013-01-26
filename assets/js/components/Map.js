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
		if(this.map.length === 0) {
			return;
		}
		// As we are targeting iPad resolution (1024 x 768) with 64-pixel block
		// Our map will have 1024 / 64 = 28 columns and 768 / 64 = 12 rows
		// 0 will be used to denoted empty blocks, 1 is for bush and 2 is for tree

		this.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
	}
});