RainbowSheep = window.RainbowSheep || {};

RainbowSheep.cfg = {
	CANVAS_WIDTH: 1028,
	CANVAS_HEIGHT: 768
};

RainbowSheep.run = function() {
	Crafty.init(this.cfg.CANVAS_WIDTH, this.cfg.CANVAS_HEIGHT);
};