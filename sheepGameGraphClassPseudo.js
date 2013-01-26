class graphClass {
	
	//Call sound functions from GraphicClass as well

	//each wolf,sheep and fruit has a gobjID that they can be accessed with


	var prime = function (map){

		this.map = map;

		//draw the bushes and trees from map array



	}

	var redraw = function (sheep,fruit,wolves) {

		//redraw sheep 


		//redraw fruit

		//redraw wolves


		//redraw trees from the map






	}


	var removeObject = function (o) {

		var oID = o.gobjID;


	}

	var sheepFallsAsleep = function(sheep) {

		//sheep that has eaten too many fruit falls asleep


	}


	var wakeSheepUp = function(sheep){

		//sheep has woken up. play animation 
	}

	var turnSheepAround = function (sheep){

		//sheep has spotted a wolf, it changes direction

	}


	var updateSheepEatingAnimation = function(sheep){

		//sheep is eating and animating

	}

	//wolf animations

	var stunWolf = function(wolf){

		//wolf was hit on the head by a falling fruit

	}

	var destunWolf = function(wolf){

		//wolf wakes up from stunned mode


	}


	var beginWolfRun = function (coordinates,wolf) {

		//wolf has spotted a sheep and is running towards it



	}



}