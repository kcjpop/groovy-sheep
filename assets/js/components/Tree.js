Crafty.c('Tree', {
	init: function() {
		this.addComponent('2D, Canvas');
		// When the mouse is clicked on
		this.bind('Click', function(e) {
		});
	},
	create: function(){
		Crafty.sprite(271, 249, "assets/img/tree.png", {
    		gfxTree: [0,0]
		});
	
		//Crafty.e('2D, Canvas, DOM, SpriteAnimation, gfxTree').attr({x:0, y:0});
		Crafty.e("2D, DOM, SpriteAnimation, Mouse, gfxTree")
			.attr({x:420, y:200})
			.animate('TreeGrowth', 0, 0, 14)
			.animate('TreeGrowth', 500, -1)
			.bind("Click", function(e){
				this.flip("X");
				var that = this;
				setTimeout(function(){
					 that.unflip("X");
				},500);
			});
		return this;
	}
});