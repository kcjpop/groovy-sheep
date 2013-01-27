//sheep gfx class

_sheepGraphClass = function() {

	var cc = this;
	cc.sprites = {};
	cc.treeIds = [];
	cc.bushIds = [];
	cc.currentTreeId  = 100;
	cc.currentBushId  = 200;
	cc.currentSheepId = 300;
	cc.currentFruitId = 400;
	cc.currentWolfId  = 500;
	cc.sounds = {};


	//Call sound functions from GraphicClass as well

	//each wolf,sheep and fruit has a gobjID that they can be accessed with
	this.init = function() {

		var parent = this,
			map = _game.map,
			i, j, m, n, coord;
		//inits crafty
		this.canvas = window.RainbowSheep || {};

		this.canvas.cfg = {
			CANVAS_WIDTH : 1028,
			CANVAS_HEIGHT : 768
		};

		Crafty.init(this.canvas.cfg.CANVAS_WIDTH, this.canvas.cfg.CANVAS_HEIGHT);
		// Crafty.background('url(assets/img/grid.png)');
		Crafty.background('url(assets/img/bg.jpg)');
		
		
		// We'll make some scenes
		Crafty.scene('Game', function() {
			
			//Crafty.e('2D, DOM, Image').image('assets/img/door.png').attr({x:832,y:0});
			
			// Create a new map and start the game
			for(i = 0, n = map.length; i < n; i++) {
				for(j = 0, m = map[i].length; j < m; j++) {
					// Create a bush
					if(map[i][j] === 1) {
						coord = cc.convertToPixel(i, j);
						cc.createBushCrafty({
							_id : cc.currentBushId++,
							_x  : coord.x,
							_y  : coord.y
						});
					}

					// Create a tree
					if(map[i][j] === 2) {
						coord = cc.convertToPixel(i, j);
						cc.createTreeCrafty({
							_id : cc.currentTreeId++,
							_x  : coord.x,
							_y  : coord.y,
							_growSpeed: Crafty.math.randomInt(50, 200)
						});
					}
				}
			}

			// cc.createTreeCrafty(treeID, 700, 59);
			//cc.createTreeCrafty(2, 200, 209);
			//cc.createTreeCrafty(3, 400, 409);
			// cc.createSheepCrafty(1, 0, 240);
			//setTimeout(function(){cc.deleteTreeCrafty(1)}, 2000);
		});
		//scenes

		// Start the game :Ds
		Crafty.scene('Game');

		//pull some soundz

		this.sounds.fruitDrop = new buzz.sound("sound/sfx_fruit_drop_1.ogg");

		this.sounds.fruitFound = new buzz.sound("sound/sfx_fruit_found_1.ogg");

		return;

	};
	//end init
	
	this.convertToPixel = function(i, j) {
		return {x: j * 64, y: i * 64};
	};

	this.convertToIndex = function(x, y) {
		var tmp;
		// return {
		// 	col: (tmp = Math.floor(x / 64)) > 0 ? tmp - 1 : tmp,
		// 	row: (tmp = Math.floor(x / 64)) > 0 ? tmp - 1 : tmp,
		// };

		return {
			col: Math.floor(x / 64),
			row: Math.floor(y / 64)
		};
	}

	this.deleteObjectCrafty = function(objectID) {
		var o = this.sprites[objectID];
		o.destroy();
	};

	this.deleteTreeCrafty = function(treeID) {
		var tree = this.sprites[treeID];
		tree.destroy();
	};

	this.createTreeCrafty = function(data) {
		cc.treeIds.push(data._id);
		Crafty.sprite(256, 235, "assets/img/tree.png", {
			gfxTree : [0, 0]
		});

		// Update map, set tree ID to the corresponding position
		var index = this.convertToIndex(data._x, data._y);
		_game.map[index.row][index.col] = data._id;
		
		cc.sprites[data._id] = Crafty.e("2D, DOM, SpriteAnimation, Mouse, gfxTree").attr({
			x : data._x,
			y : data._y
		}).animate('TreeGrowth', 0, 1, 14).animate('TreeGrowth', data._growSpeed, 0).bind("Click", function(e) {
			

			//check if the tree has already yelded a fruit
			var n =data;
			var tree = _game.trees[data._id];

			//if this tree has already yeilded fruit, dont yield another
			//check if the fruit has already disappeared , if it has, reset the yielded field

			if (tree.yieldedFruit===true) {

				console.log('tree.yieldedFruit===true');
				return false;
			}

			//play sound
			_game.graphClass.sounds.fruitDrop.stop();
			_game.graphClass.sounds.fruitDrop.play();


			//flit the tree when interaction happens

			this.flip("X");
			var that = this;
			setTimeout(function() {
				that.unflip("X");
			}, data._growSpeed);


			cc.createFruitCrafty(cc.currentFruitId, data._id, data._x + 50, data._y + 130);

			cc.sprites[data._id].animate('TreeShrink', 14, 0, 0).animate('TreeShrink',20, 0)
			tree.yieldedFruit = true;

			console.log('Tree', 'FruitFallingRow' + (index.row + 2));
			Crafty.trigger('FruitFallingRow' + (index.row + 2), cc.sprites[cc.currentFruitId]);
			//this.destroy();
			/*for(var i = 0;i<cc.treeIds.length;i++){
			 if(cc.treeIds[i]!=id){
			 cc.sprites[cc.treeIds[i]].destroy();
			 cc.treeIds.splice(cc.treeIds.indexOf(cc.treeIds[i]),1);
			 break;
			 }
			 }*/


			 cc.currentFruitId++;

			 // for(var i in _game.map)
				// console.log(_game.map[i]);

		});

		return this;
	};

	this.createSheepCrafty = function(data) {
		Crafty.sprite(88, 62, "assets/img/pig.png", {
    		gfxSheep: [0,0]
		});
		
		Crafty.sprite(88, 62, "assets/img/piggy_chew.png",{
			gfxSheepChew:[0,0]
		});
		
		var that = this, tweenSetting = {};
		
		//lets tell sheepgame that we have a new sheep here

		var d = cc.sprites;

		_game.sheep[data._id]={};
		_game.sheep[data._id].id = data._id;
		_game.sheep[data._id].parentBushID = data._parentBushID;

		cc.sprites[data._id] = Crafty.e('2D, Canvas, SpriteAnimation, Tween, Collision, gfxSheep')
			.animate('SheepWalking', 0, 0, 7)
			.animate('SheepWalking', 15, -1)
			.attr({
				x : data._x,
				y : data._y
			})
			.collision()
			.onHit('gfxFruit',function(target) {
				console.log('hitting fruit with '+data._id);
				var sheep = cc.sprites[data._id];

				var targetFruit;

				var idx = cc.convertToIndex(target[0].obj._x, target[0].obj._y);
				// for(var i in _game.map)
				// 	console.log(_game.map[i]);

				idx = _game.map[idx.row - 1][idx.col];
				targetFruit = _game.fruit[idx];

				// jQuery.each(_game.fruit,function(f,fruit){

				// 	var fy32 = fruit.y/32;
				// 	var sy32 = sheep.y/32;

				// 	if (fy32 === sy32) {

				// 		targetFruit = fruit;
				// 	}

				// });

				//target fruit found

				//play the eating sound

				//set sheep to eat for a while

				_game.sheep[data._id].isEating=true;
				
				//how long the sheep is eating and stopped
				_game.sheep[data._id].eatingTimer = 400;

				//stop sheep motion animation tween
				sheep.tween({x:sheep.x, y: sheep.y, alpha: 1}, 250);
				
				//change animation: need move to somewhere else
				sheep.removeComponent('gfxSheep').addComponent('gfxSheepChew');
				sheep.timeout(function(){
					cc.sprites[data._id].removeComponent('gfxSheepChew').addComponent('gfxSheep');
					cc.sprites[data._id].tween({x:Crafty.viewport.width, y:data._y, alpha: 1},250)
				},1500);
				//sheep.tween({x:Crafty.viewport.width, y:data._y, alpha: 1},250)
				//delete the fruit sprite
				cc.deleteObjectCrafty(targetFruit.id);

				//set the fruit parent tree so it can produce more fruit

				_game.trees[targetFruit.parentTreeID].yieldedFruit = false;

				//grow the tree back
				cc.sprites[targetFruit.parentTreeID].animate('TreeGrow', 0, 1, 14).animate('TreeGrow',50, 0)



				//delete fruit object from sheepgame
				delete(_game.fruit[targetFruit.id]);

				return;
				var t =1;
				//ghetto way to find which fruit
				//just loop all the fruit that are on the same y-location

				//play sound

				//remove fruito


				//put sheep into eating mode

			});;

		// Does it face left, or right?
		if(Crafty.math.randomInt(1, 2) === 1) {
			cc.sprites[data._id].flip('X');
			cc.sprites[data._id].isFacingRight = false;

			tweenSetting = {
				x: -128,
				y: data._y
			};

		} else {
			cc.sprites[data._id].isFacingRight = true;

			tweenSetting = {
				x: Crafty.viewport.width,
				y: data._y
			};
		}

		// Appear but no walking and check for wolf first
		// Then fruit
		var fruitInView = _game.checkForFruitInView(cc.sprites[data._id]);
		if(fruitInView.length > 0) {
			// Go go, eat some fruits
			for(var fruitId in fruitInView) {
				var fruit = cc.sprites[fruitInView[fruitId]];
				tweenSetting = {
					x: (cc.sprites[data._id].isFacingRight) ? fruit._x : fruit._x - 10,
					y: fruit._y,
					alpha: 1.0
				}
			}
		}
		// Then head to home
		
		console.log('Pig', 'FruitFallingRow'+Math.floor(data._y/64));
		cc.sprites[data._id]
			.bind('FruitFallingRow'+Math.floor(data._y/64), function(fruit) {
				var _sheep = cc.sprites[data._id];
				if(_sheep._x > fruit._x) {
					_sheep.flip('X');
				}

				_sheep.tween({
					x: fruit._x - 20,
					y: fruit._y + 40
				}, 250);
			})
		
		cc.sprites[data._id]
			.tween(tweenSetting, 250);
			// .collision()
			// .onHit("gfxTree", function(target) {
			// 	this.removeComponent('gfxSheep');
			// 	this.addComponent('gfxSheepChew')
			// 		.animate('SheepChewing', 0, 0, 7)
			// 		.animate('SheepChewing', 11, -1);
			// 	this.flip("X");
			// 	this.tween({
			// 		x : 0,
			// 		y : _y,
			// 		alpha : 1.0
			// 	}, 250).bind('TweenEnd', function() {
			// 		this.unflip("X");
			// 		this.tween({
			// 			x : _x+800,
			// 			y : _y,
			// 			alpha : 1.0
			// 		}, 250);
			// 	});
			// 	// that.obj.destroy();
			// });
	}

	this.createWolfCrafty = function(data){
		Crafty.sprite(153, 139, "assets/img/fox.png", {
    		gfxWolf: [0,0]
		});
		
		_game.wolves[data._id]={};
		_game.wolves[data._id].id = data._id;
		_game.wolves[data._id].parentBushID = data._parentBushID;


		cc.sprites[data._id] = Crafty.e('2D, Canvas, SpriteAnimation, Tween, Collision, gfxWolf')
			.animate('WolfRunning', 0, 0, 5)
			.animate('WolfRunning', 15, -1)
			.attr({
				x : data._x,
				y : data._y - 77
			}).collision().onHit('gfxFruit',function(target){
				
			});
			
		if(Crafty.math.randomInt(1, 2) === 1) {
			tweenSetting = {
				x: -128,
				y: data._y
			};
		} else {
			cc.sprites[data._id].flip('X');
			tweenSetting = {
				x: Crafty.viewport.width,
				y: data._y
			};
		}

		cc.sprites[data._id]
			.tween(tweenSetting,250);
	}
	
	this.createFruitCrafty = function(fruitID, treeID, _x, _y) {
		Crafty.sprite(32, "assets/img/apple.png", {
			gfxFruit : [0, 0]
		});

		var tweenSetting = {
			x : cc.sprites[treeID].x + 50,
			y : cc.sprites[treeID].y + 200,
			alpha : 1
		};

		cc.sprites[fruitID] = Crafty.e("2D, Canvas, Mouse, Tween, Collision, gfxFruit").attr({
			x : _x,
			y : _y
		})
		.bind("Click", function(e) {
			this.flip("X");
			var that = this;
			setTimeout(function() {
				that.unflip("X");
			}, 500);
		})
		.tween(tweenSetting, 70);

		// Update fruit ID to the corresponding in map
		var idx = this.convertToIndex(_x, _y);
		_game.map[idx.row][idx.col] = fruitID;


		//make a collision detection box for this

		//Crafty.e("2D, Collision").collision(
    	//new Crafty.polygon([50,0], [100,100], [0,100]));


		//tell main class there's afruit here
		_game.fruit[fruitID]={};
		_game.fruit[fruitID].id = fruitID;
		_game.fruit[fruitID].x = cc.sprites[treeID].x + 50;
		_game.fruit[fruitID].y =cc.sprites[treeID].y+168;
		_game.fruit[fruitID].parentTreeID = treeID;
	}
	//end create tree
	
	this.createBushCrafty = function(data) {
		Crafty.sprite(137, 100, "assets/img/bush.png", {
    		gfxBush: [0,0]
		});

		// Update bush ID to corresponding position in map
		var index = this.convertToIndex(data._x, data._y);
		_game.map[index.row][index.col] = data._id;
	
		cc.bushIds.push(data._id);
		cc.sprites[data._id] = Crafty.e("2D, Canvas, Mouse, gfxBush")
			.attr({
				x: data._x,
				y: data._y
			})
			// .animate('BushMove', 0, 0, 4)
			// .animate('BushMove', 50, -1)
			.bind("Click", function(e) {

				var bush = _game.bushes[data._id];

				//check if bush has already released a pig
				if(bush.yieldedPig===true){

					console.log('bush.yieldedPig===true');
					return false;
				}

				_game.graphClass.sounds.fruitFound.stop();
				_game.graphClass.sounds.fruitFound.play();

				this.flip("X");
				var that = this;
				setTimeout(function(){
					 that.unflip("X");
				},500);

				// Here come the sheep
				// Or maybe the wolf
				if(Crafty.math.randomInt(1, 10) > 3){
					cc.createSheepCrafty({
						_id: cc.currentSheepId++,
						_parentBushID: data._id,
						_x : data._x,
						_y : data._y + 40
					});
				} else { // create wolf
					cc.createWolfCrafty({
						_id: cc.currentWolfId++,
						_parentBushID: data._id,
						_x : data._x,
						_y : data._y + 40
					});
				}

				/*cc.createSheepCrafty({
						_id: cc.currentSheepId++,
						_parentBushID: data._id,
						_x : data._x,
						_y : data._y + 40
					});*/
					
				//tell this bush has already yielded a sheep	
				bush.yieldedPig=true;


				// if(Crafty.math.randomInt(1, 2) === 1)
				// 	cc.createSheepCrafty(cc.currentSheepId++, data._x, data._y);
				// else
				// 	cc.createSheepCrafty(cc.currentSheepId++, data._x, data._y);
			});

			

	};

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
		console.log('Sheep eating');
		console.log(sheep);
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
