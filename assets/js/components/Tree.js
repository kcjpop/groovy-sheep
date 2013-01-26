Crafty.c('Tree', {
	init: function() {
		this.addComponent('2D, Canvas');

		// When the mouse is clicked on
		this.bind('Click', function(e) {

		});
	},
	createTree: function(){
		Crafty.sprite(271, 249, "assets/img/tree.png", {
    		gfxTree: [0,0]
		});
		
		Crafty.e('2D, Canvas, gfxTree').attr({x:0, y:0});
		return this;
	}
});