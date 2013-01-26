

class sheepgame {

	var this.sheepEatingTimerDefault = 4000; //sheep eats for 4000 microseconds

	var this.volves = {};
	var this.sheep = {};
	var this.fruit = {};
	var this.bushes = {};
	var this.trees = {};
	var this.lastClickedBushID = 0;
	var this.lastClickedTreeID =0;
	
	var this.defaultWolfStunTimer = 8000; //the wolf is stunned for a long time

	var this.fruitFallingSpeed = 3;

	init: {

		//create the map with the trees bushes and the sheephouse
		var map = this.createRandomMap();

		//the logical map that contains locations of trees & bushes is stored in sheepgame
		this.map = map;	

		//locate bushes in map and put them into this.bushes

		//locate trees in map and put them into this.trees

	}

	mainloop: {

		if (this.rainbowAnimationRunning===true){

			//continue running rainbow anim

			return;
		}

		if (this.endOfDayAnimationRunning===true){

			//continue showing end of the day anim

			return;
		}

		//update any sheep that are currently on map

		var sheep = updateSheepOnMap();

		//update fruit on map
		var fruit = updateFruitOnMap();

		//update any wolves on map
		var wolves = updateWolvesOnMap();

		//redraw map

		this.graphClass.redraw(sheep,fruit,wolves);



	}


	this.updateSheepOnMap=function() {

		var parent = this;
		var flushSheep = {};		//sheep get flushed (removed from the map) when they walk home

		jQuery.each(this.sheep,function(k,sheep){

			if(sheep.isEating===true){

				//if sheep is eating, it wont move for a while

				sheep.eatingTimer = v.eatingTimer-1;
				
				if (sheep.eatingTimer<1) {

					//wake this sheep up
					sheep.eatingTimer =0;
					sheep.isEating = false;

					//pass sheep object to graphicLibrary to start the wake up animation
					parent.graphClass.updateSheepEatingAnimation(sheep);

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

				parent.graphClass.turnSheepAround(sheep));
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
			parent.graphClass.removeObject(sheep);


			delete(parent.sheep[sheep.sheepID]);

		});

	}	//end of updateSheepOnMap

	this.updateWolvesOnMap=function(){


		var parent = this;
		
		//if a wolf needs to be removed, add it to flush wolves
		var flushWolves = {};

		jQuery.each(this.wolves,function(k,wolf){

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



}