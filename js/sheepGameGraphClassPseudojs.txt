class graphClass {
	
	//Call sound functions from GraphicClass as well

	//each wolf,sheep and fruit has a gobjID that they can be accessed with


	function prime = function (map){

		this.map = map;

		//draw the bushes and trees from map array



	}

	function redraw = function (sheep,fruit,wolves) {

		//redraw sheep 


		//redraw fruit

		//redraw wolves


		//redraw trees from the map






	}


	function removeObject = function (o) {

		var oID = o.gobjID;


	}

	function sheepFallsAsleep = function(sheep) {

		//sheep that has eaten too many fruit falls asleep


	}


	function wakeSheepUp = function(sheep){

		//sheep has woken up. play animation 
	}

	function turnSheepAround = function (sheep){

		//sheep has spotted a wolf, it changes direction

	}


	function updateSheepEatingAnimation = function(sheep){

		//sheep is eating and animating

	}

	//wolf animations

	function stunWolf = function(wolf){

		//wolf was hit on the head by a falling fruit

	}

	function destunWolf = function(wolf){

		//wolf wakes up from stunned mode


	}


	function beginWolfRun = function (coordinates,wolf) {

		//wolf has spotted a sheep and is running towards it



	}



}