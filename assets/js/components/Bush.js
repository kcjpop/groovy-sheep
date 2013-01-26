Crafty.c('Bush', {
	init: function() {
		this.addComponent('2D, Canvas, Color');

		// When the mouse is clicked on
		this.bind('Click', function(e) {

		});
	},
	create: function(color){
		Crafty.sprite(137, 100, "assets/img/bush.png", {
    		gfxBush: [0,0]
		});
	
		Crafty.e("2D, DOM, SpriteAnimation, Mouse, gfxBush")
			.attr({x:200, y:500})
			.animate('BushMove', 0, 0, 4)
			.animate('BushMove', 50, -1)
			.bind("Click", function(e){
				this.flip("X");
				var that = this;
				setTimeout(function(){
					 that.unflip("X");
				},500);
			});
	}
});