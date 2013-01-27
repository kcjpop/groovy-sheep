


_sheepgame = function () {
    
    var cc = this;
	cc.sheepEatingTimerDefault = 4000; //sheep eats for 4000 microseconds

	cc.wolves = {};
	cc.sheep = {};
	cc.fruit = {};
	cc.bushes = {};
	cc.trees = {};
	cc.lastClickedBushID = 0;
	cc.lastClickedTreeID =0;

	cc.defaultWolfStunTimer = 8000; //the wolf is stunned for a long time

	cc.fruitFallingSpeed = 3;

	cc.rainbowAnimationRunning = false;
	cc.endOfDayAnimationRunning = false;

	this.init = function() {

		//create the map with the trees bushes and the sheephouse
		var map = this.createRandomMap();

		//the logical map that contains locations of trees & bushes is stored in sheepgame
		this.map = map;	

		//display text map for debugging
		this.showTextMap(map);

		//create the graph class with crafy

		this.graphClass = new _sheepGraphClass();


		//locate bushes & trees in map and put them into this.bushes
		var bushID = 200;
		var treeID = 100;

		//loop the map

		for(i = 0, n = map.length; i < n; i++) 	{
				for(j = 0, m = map[i].length; j < m; j++) {
					// Create a bush
					if(map[i][j] === 1) {

						this.bushes[bushID]={};
						this.bushes[bushID]._id = bushID;
						
						coord = this.graphClass.convertToPixel(i, j);

						this.bushes[bushID].x = coord.x;
						this.bushes[bushID].y = coord.y;

						this.bushes[bushID].yieldedPig = false;

						bushID++;
					}

					if(map[i][j] === 2) {

						this.trees[treeID]={};
						this.trees[treeID]._id = bushID;
						
						coord = this.graphClass.convertToPixel(i, j);

						this.trees[treeID].x = coord.x;
						this.trees[treeID].y = coord.y;

						this.trees[treeID].yieldedFruit = false;

						treeID++;
					}

					
					}
				}	//end map loop
			


		//locate trees in map and put them into this.trees


		

		//init the graph class
		// An: pass the map array to draw		
		this.graphClass.init(this.map);

		//run mainloop
		setInterval(this.mainloop,1000);

	}	//end of init

	this.mainloop = function () {

		var parent = _game;

		if (this.rainbowAnimationRunning===true){

			//continue running rainbow anim

			return;
		}

		if (this.endOfDayAnimationRunning===true){

			//continue showing end of the day anim

			return;
		}

		//update any sheep that are currently on map

		var sheep = parent.updateSheepOnMap();

		//update fruit on map
		var fruit = parent.updateFruitOnMap();

		//update any wolves on map
		var wolves = parent.updateWolvesOnMap();

		//redraw map

		//this.graphClass.redraw(sheep,fruit,wolves);



	}	//end of main


	this.updateSheepOnMap=function() {

		var parent = this;
		var flushSheep = {};		//sheep get flushed (removed from the map) when they walk home

		jQuery.each(this.sheep,function(k,sheep){

			//pull the sprites current coordinates from gfx.sprites[id];
			var sprite = parent.graphClass.sprites[sheep.id];
			
			//copy these props 
			sheep.x = sprite.x;
			sheep.y = sprite.y;

			//if the sheep has walked over the edge, just delete the sprite

			if (sheep.x < -64) {

				//just get rid of the sprite here;

				console.log('sheep over the edge. delete.');
				parent.graphClass.deleteObjectCrafty(sheep.id);
				flushSheep[sheep.id]=sheep;
				return;

			}

			if (sheep.x > 1027 ) {

				console.log('sheep over the edge. delete.');

				//just get rid of the sprite here;
				parent.graphClass.deleteObjectCrafty(sheep.id);
				flushSheep[sheep.id]=sheep;
				return;
				
			}


			//also deduct tile sizes coordinates
			sheep.xMod = sprite.x / 32;
			sheep.yMod = sprite.y / 32;

			if(sheep.isEating===true){

				//if sheep is eating, it wont move for a while

				sheep.eatingTimer = sheep.eatingTimer-1;
				
				if (sheep.eatingTimer<1) {

					//wake this sheep up
					sheep.eatingTimer =0;
					sheep.isEating = false;

					//make the sheep walk again

					//pass sheep object to graphicLibrary to start the wake up animation
					//parent.graphClass.updateSheepEatingAnimation(sheep);

					return;
				}


				return;

			} else {

				//check for fruit collision
				var fruit =parent.checkSheepFruitCollision(sheep);
				if (fruit!==false) {

					//delete fruit from the map

					//play sound

					sheep.isEating = true;
					sheep.eatingTimer = parent.sheepEatingTimerDefault; 	//in ms

					parent.graphClass.updateSheepEatingAnimation(sheep);

					//remove fruit obj from screen
					parent.graphClass.removeObject(fruit);

					//remove fruit parent object so we dont have to bother with it anymore
					delete(parent.fruit[fruit.fruitID]);

					return;
				}

			}

			if (sheep.isSleeping===true){

				//this sheep had too many fruit and fell asleep.
				//sleeping sheep dont move

				sheep.sleepTimer = sheep.sleepTimer-1;

				if (sheep.sleepTimer<1) {

					//wake this sheep up
					sheep.sleepTimer =0;
					sheep.isSleeping = false;

					//pass sheep object to graphicLibrary to start the wake up animation
					parent.graphClass.wakeSheepUp(sheep);

					return;
				}

			}	//end of sleeping check

			//check if sheep sees a wolf, it changes direction and runs away

			if (parent.checkForWolfInView(sheep)===true){

				//change direction
				//direction doesn't care about up down movement

				if (sheep.sheepDirection===1){
					sheep.sheepDirection=0;
				} else {

					sheep.sheepDirection=1;
				}

				parent.graphClass.turnSheepAround(sheep);
				return;

			}

			//check if sheep sees a fruit, it walk toward it

			if (parent.checkForFruitInView(sheep)===true){

				//alter sheep coordinates so that it goes closer to the fruit

				return;

			}

			if (parent.sheepReachedHome(sheep)===true) {

				//display animation for sheep arriving home
				parent.graphClass.sheepArrivedHome(sheep);
				flushSheep[sheep.sheepID]=sheep;

				return;

			}


			//default to look for path towards the exit

			var coordinates = parent.navigateTowardsExit(sheep);

			if (coordinates!==false) {

				sheep.x = coordinates.x;
				sheep.y = coordinates.y;

			}


			//update sheep walking animation

		});	//end of sheep loop
		
		//check if any of the sheep were flushed

		jQuery.each(flushSheep,function(s,sheep){

			//remove from view
			parent.graphClass.removeObject(sheep.id);

			parent.bushes[sheep.parentBushID].yieldedPig=false;

			delete(parent.sheep[sheep.id]);
			console.log('sheep '+sheep.id+' deleted from canvas and flushed. parentBush marked bush.yieldedPig===false');

		});

	}	//end of updateSheepOnMap

	this.checkForWolfInView = function(sheep){

		//checks if this sheep can see the wolf

		return false;


	};	//end checkForWolfInView

	this.checkForFruitInView=function(sheep){

		//checks if the sheep can see a fruit. if it can, make it walk towards the fruit

		return false;

	};	//end of checkForFruitInView

	this.checkSheepFruitCollision = function(sheep){

		//ghetto check for collisions

		return false;

	};	//checkSheepFruitCollision

	this.sheepReachedHome = function(sheep){

		//check if this sheep is home safe. happy times!

		return false;

	};	//end of sheepReachedHome

	this.navigateTowardsExit = function(sheep){

		//judge the best movement from this position to find home

		return false;

	};	//end of navigateTowards exit

	this.updateWolvesOnMap=function(){


		var parent = this;
		
		//if a wolf needs to be removed, add it to flush wolves
		var flushWolves = {};

		jQuery.each(this.wolves,function(k,wolf){
			var sprite = parent.graphClass.sprites[wolf.id];
			
			//copy these props 
			wolf.x = sprite.x;
			wolf.y = sprite.y;

			//if the sheep has walked over the edge, just delete the sprite

			if (wolf.x < -64) {

				//just get rid of the sprite here;

				console.log('wolf over the edge. delete.');
				parent.graphClass.deleteObjectCrafty(wolf.id);
				flushWolves[wolf.id]=wolf;
				return;

			}

			if (wolf.x > 1027 ) {

				console.log('wolf over the edge. delete.');

				//just get rid of the sprite here;
				parent.graphClass.deleteObjectCrafty(sheep.id);
				flushWolves[wolf.id]=wolf;
				return;
				
			}
			
			//check wolf fruit collision

			var fruit = parent.checkWolfDroppingFruitCollision(wolf);
			if (fruit!==false) {

				//our wolf was hit by a dropping fruit

				wolf.stunTimer = parent.defaultWolfStunTimer;
				wolf.isStunned = true;


				//init wolf stun animation
				parent.graphClass.stunWolf(wolf);

				//get rid of the fruit on screen

				parent.graphClass.removeObject(fruit);

				//get rid of its parent object

				delete(parent.fruit[fruit.fruitID]);

				return;

			}


			if (wolf.isStunned===true){

				//wolf was hit on the head with a falling fruit
				wolf.stunTimer = wolf.stunTimer-1;

				if (wolf.stunTimer<1) {

					//wake this sheep up
					wolf.stunTimer=0;
					wolf.isStunned = false;

					//pass wolf object to graphicLibrary to start the destun up animation
					parent.graphClass.destunWolf(wolf);

					//maybe change wolf direction?


					return;
				}

			}	//wolf stunned


			var sheep = parent.checkForWolfWithSheepInView(wolf);

			if (sheep!==false){

				if (wolf.isRunning===true){

					//continue business as usual, run to wards the sheep

					//if sheep is already out of the way, wolf runs outside the screen and disappears completely

					if (wolf.x>parent.screenWidth) {

						//it's outside the screen. just erase it
						flushWolves[wolf.wolfID]=wolf;

						return;
					}

					return;
				
				} else {

					//wolf might see many sheep. pick one at random

					var targetSheep = parent.chooseRandomTargetSheep(sheep);

					var coordinates = parent.navigateWolfTowardsSheep(wolf,targetSheep);

					parent.graphClass.beginWolfRun(coordinates,wolf);

					return;

				}


			} //end of sheep detected

			//if the wolf is not knocked out, running or spotting a sheep, it can sit still or walk about






		});	//end updating wolves

		//check if any wolves need to be removed from screen (flushed)
		jQuery.each(flushWolves,function(s,wolf){

			//remove from view
			parent.graphClass.removeObject(wolf);


			delete(parent.wolves[wolf.wolfD]);

		});


	} //end of updateWolvesOnMap

	this.updateFruitOnMap = function (){

		//this checks if we have to move any falling fruit
		var parent = this;

		//flushFruit for removing fruit for some reason or another
		var flushFruit = {};

		jQuery.each(this.fruit,function(f,fruit){

			if (fruit.isFalling===true){

				//this fruit is falling down, update it's coordinates
				if (fruit.y<fruit.targetY) {

					fruit.y = fruit.y + parent.fruitFallingSpeed;
					return;
				} else {

					fruit.isFalling = false;
					fruit.y = fruit.targetY;
					return;
				}

			}	//fruit was falling




		});	//end looping fruit

		//or delete fruit that have been on screen for too long



	};	//end updateFruitOnMap

	this.clickBush = function(bushID) {

		//does the bush exist
		if (this.bushes[bushID]===undefined) {

			//strange thing. happens because of?

			return false;
		}

		//check if the bush is moving

		var bush = this.bushes[bushID];

		if (bush.isMoving!==true){

			//this bush is not animating

			//play the i'm sorry sound

			//animate the clicked bush somewho to indicate it was tapped


			return false;

		}


	};	//end clickBush


	this.createRandomMap = function(){


		var map = [
			[0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
			[0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		return map;

	};	//end create random map

	this.showTextMap = function(map){

		//zPlayfield
		$('#zPlayfield').empty();

		var l='<pre>';
		jQuery.each(map,function(){

			jQuery.each(this,function(k,v){

				if (v===0){ l=l+'-'; }
				if (v===1){ l=l+'B'; }
				if (v===2){ l=l+'T'; }

			});

			l=l+'</br>';


		});


		l=l+'</pre>';

		$('#zPlayfield').html(l);
	};


}





$(document).ready(function () {


	console.log('vittu');

	_game = new _sheepgame();

	_game.init();

	//sound player buzz defaults

	// Preload the sound
	// auto, metadata, none
	buzz.defaults.preload = 'auto';
	// Play the sound when ready
	// bool
	buzz.defaults.autoplay = false;
	// Loop the sound
	// bool
	buzz.defaults.loop = false;


	});
