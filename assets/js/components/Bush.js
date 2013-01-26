Crafty.c('Bush', {
	init: function() {
		this.addComponent('2D, Canvas, Color');

		// When the mouse is clicked on
		this.bind('Click', function(e) {

		});
	},
	createBush: function(color){
		var x = Math.random() * 100 >> 0;
      	var y = Math.random() * 100 >> 0;
		this.attr({x: x, y: y, w: 20, h: 20}).color(color);
      	return this;
	}
});