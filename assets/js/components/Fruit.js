Crafty.c('Fruit', {
	init: function() {
		this.addComponent('2D, Canvas, Color');

		// When the mouse is clicked on
		this.bind('Click', function(e) {

		});
	},
	create: function(color){
		Crafty.sprite(16, "assets/img/apple.png", {
    		gfxBush: [0,0]
		});
	
		Crafty.e("2D, DOM, SpriteAnimation, Mouse, gfxBush")
			.attr({x:200, y:500})
			.bind("Click", function(e){
				this.flip("X");
				var that = this;
				setTimeout(function(){
					 that.unflip("X");
				},500);
			});
	}
});