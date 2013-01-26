Crafty.c('Sheep', {
	obj: null,
	init: function() {
		this.addComponent('2D, Canvas');
		Crafty.sprite(88, 62, "assets/img/pig.png", {
    		gfxSheep: [0,0]
		});
	},
	create: function(clickHandler) {
		this.obj = Crafty.e('2D, Canvas, SpriteAnimation, Tween, gfxSheep')
			.bind('Click', clickHandler)
			.animate('SheepWalking', 0, 0, 7)
			.animate('SheepWalking', 15, -1)
			.attr({
				x: 400,
				y: 400
			});

		return this;
	},
	walk: function() {
		if(this.obj === null)
			return;

		this.obj.addComponent('Tween')
			.tween({
				x: 600,
				y: 400,
				alpha: 1.0
			}, 250);

		return this;
	},
	eat: function() {
		return this;
	}
});