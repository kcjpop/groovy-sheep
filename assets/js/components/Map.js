Crafty.c('Map', {
	/**
	 * Store map data
	 * @type {Array}
	 */
	map : [],
	mapWidth: 0,
	mapHeight: 0,
	init: function() {
		this.addComponent('2D, Canvas, Color');
		this.mapWidth = Crafty.viewport.width / 64;
		this.mapHeight = Crafty.viewport.height / 64;
		this.create(3, 3);
	},
	/**
	 * Take coordinations in pixels and return corresponding indexes
	 * @param  {int} x
	 * @param  {int} y 
	 * @return {array}
	 */
	convertToIndex: function(x, y) {
		return {x: Math.floor(x/64), y: Math.floor(y/64)};
	},
	/**
	 * Take array indexes and return corresponding pixel coordination
	 * @param  {int} x 
	 * @param  {int} y
	 * @return {object}
	 */
	convertToPixel: function(x, y) {
		return {x: x * 64, y: y * 64};
	},
	_findPath: function(x, y, targetX, targetY) {
		if(this.map.length === 0)
			return;

		var stack = [],
			// Array to flag visited point
			flag = [],
			// Array to trace back the previous point
			trace = [],
			// The current point
			current,
			i, j, m, n;

		// Init empty trace and flag
		for(i = 0, n = this.map.length; i < n; i++) {
			if(!(flag[i] instanceof Array))
				flag[i] = [];

			if(!(trace[i] instanceof Array))
				trace[i] = [];

			for(j = 0, m = this.map[i].length; j < m; j++) {
				flag[i][j] = trace[i][j] = 0;
			}
		}

		stack.push({x: x, y: y});
		while(stack.length > 0) {
			// console.log(stack);
			current = stack.pop();
			if(current.x < 0 || current.x > this.mapHeight || current.y < 0 || current.y > this.mapWidth) {
				continue;
			}

			// If there is something at the target, unable to move
			if(this.map[current.y][current.x] !== 0 || flag[current.y][current.x] === 1) {
				continue;
			}

			// Reach the goal
			if(current.x === targetX && current.y === targetY) {
				return trace;
			}

			// Push new work
			if(current.y > 0) {
				stack.push({x: current.x, y: current.y - 1});
				if(trace[current.x][current.y - 1] === 0) {
					trace[current.x][current.y - 1] = current;
				}
			}

			if(current.x < this.mapHeight) {
				stack.push({x: current.x + 1, y: current.y});
				if(trace[current.x + 1][current.y] === 0)
					trace[current.x + 1][current.y] = current;
			}

			if(current.x > 0) {
				stack.push({x: current.x - 1, y: current.y});
				if(trace[current.x - 1][current.y] === 0)
					trace[current.x -1][current.y] = current;
			}

			// Mark
			flag[current.y][current.x] = 1;
		}

		return trace;
	},
	/**
	 * Get path from one point to another point
	 * @param  {int} x       current X
	 * @param  {int} y       current Y
	 * @param  {int} targetX 
	 * @param  {int} targetY 
	 * @return {obj}         coord of next move
	 */
	getPath: function(x, y, targetX, targetY) {
		var trace = this._findPath(x, y, targetX, targetY);
		if(trace.length === 0) {
			return;
		}

		var res = [],
			tmp = {x: targetX, y: targetY},
			des = {x: x, y: y};

		// for(var i = 0, n = trace.length; i < n; i++) {
		// 	for(var j = 0, m = trace[i].length; j < m; j++) {
		// 		console.log(i+':'+j, trace[i][j]);
		// 	}
		// }
		while(!(tmp.x === des.x && tmp.y === des.y)) {
			res.push(tmp);
			tmp = {x: trace[tmp.x][tmp.y].x, y: trace[tmp.x][tmp.y].y};
		}

		res.push(des);
		return res;
	},
	/**
	 * Create a new map
	 * @param  {int} bush Number of bushes
	 * @param  {int} tree Number of trees
	 * @return {array}      A 2-dimentional array representing the map
	 */
	create: function(bush, tree) {
		// Check map existance
		if(this.map.length !== 0) {
			return;
		}
		// As we are targeting iPad resolution (1024 x 768) with 64-pixel block
		// Our map will have 1024 / 64 = 16 columns and 768 / 64 = 12 rows
		// 0 will be used to denoted empty blocks, 1 is for bush and 2 is for tree

		// var i, j, randomX, randomY,
		// 	cols = Crafty.viewport.width / 64,
		// 	rows = Crafty.viewport.height / 64,
		// 	tmp = [
		// 		[bush, 1],
		// 		[tree, 2]
		// 	];

		// // Create elmpty map
		// for(i = 0; i < rows; i++) {
		// 	if(!(this.map[i] instanceof Array)) {
		// 		this.map[i] = [];
		// 	}

		// 	for(j = 0; j < cols; j++) {
		// 		this.map[i][j] = 0;
		// 	}
		// }

		// // Randomly put trees and bushes
		// for(i in tmp) {
		// 	while(tmp[i][0] > 0) {
		// 		randomX = Crafty.math.randomInt(0, rows - 1);
		// 		randomY = Crafty.math.randomInt(0, cols - 1);
		// 		if(this.map[randomX][randomY] === 0) {
		// 			this.map[randomX][randomY] = tmp[i][1];
		// 			tmp[i][0]--;
		// 		}
		// 	}
		// }


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
