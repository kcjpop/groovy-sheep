RainbowSheep = window.RainbowSheep || {};

RainbowSheep.cfg = {
	CANVAS_WIDTH: 1028,
	CANVAS_HEIGHT: 768
};

RainbowSheep.run = function() {
	Crafty.init(this.cfg.CANVAS_WIDTH, this.cfg.CANVAS_HEIGHT);
	Crafty.background('url(assets/img/grid.png)');

	// We'll make some scenes
	Crafty.scene('Game', function() {
		// Create a new map and start the game
		var map = Crafty.e('Map');
		var a = map.getPath(5, 5, 12, 0);
		console.log(a);
	});

	// Start the game :D
	Crafty.scene('Game');
};

