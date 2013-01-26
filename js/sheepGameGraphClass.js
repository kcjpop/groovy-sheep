//sheep gfx class

_sheepGraphClass = function() {

	var cc = this;
	cc.sprites = {};
	cc.treeIds = [];
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
			cc.createTreeCrafty(treeID, 700, 59);
			//cc.createTreeCrafty(2, 200, 209);
			//cc.createTreeCrafty(3, 400, 409);
			cc.createSheepCrafty(1, 0, 240);
			//setTimeout(function(){cc.deleteTreeCrafty(1)}, 2000);
		});
		//scenes

		// Start the game :Ds
		Crafty.scene('Game');

		return;

	};
	//end init

	this.deleteTreeCrafty = function(treeID) {
		var tree = this.sprites[treeID];
		tree.destroy();
	}

	this.createTreeCrafty = function(treeID, _x, _y) {
		var id = treeID;
		cc.treeIds.push(id);
		Crafty.sprite(256, 235, "assets/img/tree.png", {
			gfxTree : [0, 0]
		});

		cc.sprites[treeID] = Crafty.e("2D, DOM, SpriteAnimation, Mouse, gfxTree").attr({
			x : _x,
			y : _y
		}).animate('TreeGrowth', 0, 3, 14).animate('TreeGrowth', 500, -1).bind("Click", function(e) {
			this.flip("X");
			var that = this;
			setTimeout(function() {
				that.unflip("X");
			}, 500);
			cc.createFruitCrafty(1, treeID, _x + 50, _y + 50);
			//this.destroy();
			/*for(var i = 0;i<cc.treeIds.length;i++){
			 if(cc.treeIds[i]!=id){
			 cc.sprites[cc.treeIds[i]].destroy();
			 cc.treeIds.splice(cc.treeIds.indexOf(cc.treeIds[i]),1);
			 break;
			 }
			 }*/
		});

		return this;

	};

	this.createSheepCrafty = function(sheepID, _x, _y) {
		Crafty.sprite(88, 62, "assets/img/pig.png", {
    		gfxSheep: [0,0]
		});
		
		Crafty.sprite(88, 62, "assets/img/piggy_chew.png",{
			gfxSheepChew:[0,0]
		});
		
		var that = this;
		
		Crafty.e('gfxTree, 2D, Canvas, SpriteAnimation, Tween, Collision, gfxSheep')
		.animate('SheepWalking', 0, 0, 7)
		.animate('SheepWalking', 15, -1).attr({
			x : _x,
			y : _y
		}).tween({x:_x+700,y:_y,alpha:1.0},250)
		.collision()
		.onHit("gfxTree", function(target) {
			this.removeComponent('gfxSheep');
			this.addComponent('gfxSheepChew')
				.animate('SheepChewing', 0, 0, 7)
				.animate('SheepChewing', 11, -1);
			/*this.flip("X");
			this.tween({
				x : 0,
				y : _y,
				alpha : 1.0
			}, 250).bind('TweenEnd', function() {
				this.unflip("X");
				this.tween({
					x : _x+800,
					y : _y,
					alpha : 1.0
				}, 250);
			});*/
			//that.obj.destroy();
		});
	}

	this.createFruitCrafty = function(fruitID, treeID, _x, _y) {
		Crafty.sprite(32, "assets/img/apple.png", {
			gfxFruit : [0, 0]
		});

		Crafty.e("2D, DOM, Mouse, Tween, gfxFruit").attr({
			x : _x,
			y : _y
		}).bind("Click", function(e) {
			this.flip("X");
			var that = this;
			setTimeout(function() {
				that.unflip("X");
			}, 500);
		}).tween({
			x : cc.sprites[treeID].x + 50,
			y : cc.sprites[treeID].y + 240,
			alpha : 1
		}, 100);
	}
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
