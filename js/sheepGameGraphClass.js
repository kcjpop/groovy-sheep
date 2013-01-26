
//sheep gfx class

_sheepGraphClass =function() {
	
	var cc = this;
	
	//Call sound functions from GraphicClass as well

	//each wolf,sheep and fruit has a gobjID that they can be accessed with


	this.prime = function (map){

		this.map = map;

		//draw the bushes and trees from map array



	}

	this.redraw = function (sheep,fruit,wolves) {

		//redraw sheep 


		//redraw fruit

		//redraw wolves


		//redraw trees from the map






	} //end redraw


	this.removeObject = function (o) {

		var oID = o.gobjID;


	}

	this.sheepFallsAsleep = function(sheep) {

		//sheep that has eaten too many fruit falls asleep


	}


	this.wakeSheepUp = function(sheep){

		//sheep has woken up. play animation 
	}

	this.turnSheepAround = function (sheep){

		//sheep has spotted a wolf, it changes direction

	}


	this.updateSheepEatingAnimation = function(sheep){

		//sheep is eating and animating

	}

	//wolf animations

	this.stunWolf = function(wolf){

		//wolf was hit on the head by a falling fruit

	}

	this.destunWolf = function(wolf){

		//wolf wakes up from stunned mode


	}


	this.beginWolfRun = function (coordinates,wolf) {

		//wolf has spotted a sheep and is running towards it



	}



}
