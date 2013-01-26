RainbowSheep = window.RainbowSheep || {};

RainbowSheep.cfg = {
	CANVAS_WIDTH: 1028,
	CANVAS_HEIGHT: 768
};

RainbowSheep.run = function() {
	Crafty.init(this.cfg.CANVAS_WIDTH, this.cfg.CANVAS_HEIGHT);
	Crafty.background('#fff');

	// We'll make some scenes
	Crafty.scene('Game', function() {
		// Create a new map and start the game
		Crafty.e('Map');
		Crafty.e('Bush').createBush('#FF6600');
	});

	// Start the game :D
	Crafty.scene('Game');
};