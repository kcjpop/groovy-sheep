Crafty.c('Sheep', {
	obj: null,
	init: function() {
		this.addComponent('gfxTree,2D, Canvas, Collision, Fourway');
		Crafty.sprite(88, 62, "assets/img/pig.png", {
    		gfxSheep: [0,0]
		});
		this.fourway(2);
		/*this.collision(new Crafty.polygon([50,0], [100,100], [0,100]));
		this.onHit("gfxTree", function(target){
			console.log('hit');
		});*/
	},
	create: function(clickHandler) {
		this.obj = Crafty.e('gfxTree, 2D, Canvas, Fourway,SpriteAnimation, Tween, Collision, Fourway, gfxSheep')
			.bind('Click', clickHandler)
			.animate('SheepWalking', 0, 0, 7)
			.animate('SheepWalking', 15, -1)
			.attr({
				x: 0,
				y: 390
			});
		this.obj.fourway(2);
		this.obj.collision();
		var that = this;
		this.obj.onHit("gfxTree", function(target){
			that.obj.flip("X");
			that.obj.tween({
				x: 0,
				y: 400,
				alpha: 1.0
			}, 250).bind('TweenEnd', function(){
				this.unflip("X");
				this.tween({x: 600,y: 400,alpha: 1.0}, 250);
			});
			//that.obj.destroy();
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
	},
	fallAsSleep: function() {

	},
	wakeUp: function() {

	},
	turnAround: function() {
		
	}
});