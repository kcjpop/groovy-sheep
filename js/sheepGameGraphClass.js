//sheep gfx class

_sheepGraphClass = function() {

	var cc = this;
	cc.sprites ={};
	//Call sound functions from GraphicClass as well

	//each wolf,sheep and fruit has a gobjID that they can be accessed with
	this.init = function() {

		var parent = this;
		//inits crafty
		this.canvas = window.RainbowSheep || {};

		this.canvas.cfg = {
			CANVAS_WIDTH : 1028,
			CANVAS_HEIGHT : 768
		};

		Crafty.init(this.canvas.cfg.CANVAS_WIDTH, this.canvas.cfg.CANVAS_HEIGHT);
		Crafty.background('url(assets/img/grid.png)');

		var treeID = 1;

		// We'll make some scenes
		Crafty.scene('Game', function() {
			// Create a new map and start the game
			/*Crafty.e('Map');
			 Crafty.e('Tree').createTree();
			 Crafty.e('Sheep').create().walk();
			 */

			Crafty.e(parent.createTreeCrafty(treeID, 50, 59));
			//setTimeout(
				//parent.deleteTreeCrafty(1), 
			//1000);
		});
		//scenes

		// Start the game :Ds
		Crafty.scene('Game');
		
	
		return;
		
	};
	//end init

	this.deleteTreeCrafty = function (treeID) {
		//var tree = this.sprites[treeID];
		//tree.destroy();
		
	}
	
	this.createTreeCrafty = function(treeID, _x, _y) {
		//Crafty.e('Tree').create(50,50);
		
		/*var tree = Crafty.e();
		tree.addComponent("2D, Canvas, Color");
		tree.color("white").attr({
			w : 50,
			h : 50,
			x : 150
		});
		tree.sprite(x, y, "assets/img/tree.png", {
			gfxTree : [0, 0]
		});*/
		
		 Crafty.sprite(271, 249, "assets/img/tree.png", {
    		gfxTree: [0,0]
		});
		
		//this.sprites[treeID].attr({x:_x, y:_y});
		
		//return this.sprites[treeID];
		
		//Crafty.e('2D, Canvas, DOM, SpriteAnimation, gfxTree').attr({x:0, y:0});
		this.sprites[treeID] = Crafty.e("2D, DOM, SpriteAnimation, Mouse, gfxTree")
			.attr({x:_x, y:_y})
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

	};
	//end create tree

	this.prime = function(map) {

		this.map = map;

		//draw the bushes and trees from map array

	}

	this.redraw = function(sheep, fruit, wolves) {

		//redraw sheep

		//redraw fruit

		//redraw wolves

		//redraw trees from the map

	}//end redraw

	this.removeObject = function(o) {

		var oID = o.gobjID;

	}

	this.sheepFallsAsleep = function(sheep) {

		//sheep that has eaten too many fruit falls asleep

	}

	this.wakeSheepUp = function(sheep) {

		//sheep has woken up. play animation
	}

	this.turnSheepAround = function(sheep) {

		//sheep has spotted a wolf, it changes direction

	}

	this.updateSheepEatingAnimation = function(sheep) {

		//sheep is eating and animating

	}
	//wolf animations

	this.stunWolf = function(wolf) {

		//wolf was hit on the head by a falling fruit

	}

	this.destunWolf = function(wolf) {

		//wolf wakes up from stunned mode

	}

	this.beginWolfRun = function(coordinates, wolf) {

		//wolf has spotted a sheep and is running towards it

	}
}
