// Contains the objects used in the game
(function(){

rigger.Player = function(who){
	this.who = function(){return who;};

	this.speed = 100; // Speed in px/s

	this.g = {
		w : 50,
		h : 50,
		x : 5,
		y : 0
		//i : rigger.assets.sprites.player[who]
	};
	this.g.y = rigger.height - this.g.h;
	this.draw = function(){
		rigger.ctx.fillStyle = "blue";
		rigger.ctx.fillRect(this.g.x, this.g.y, this.g.w, this.g.h);
	};
};

rigger.Bar = function(){ // Represents a bar in the annex
	this.bar = (function(b){var a = []; while(a.length < b){a.push(false)} return a;})(rigger.settings.barSize); // Create an array of 20 false values (false means empty)


	this.g = {
		x : 0,
		y : 0,
		w : 0,
		h : 0
	};
	this.draw = function(){

	};
};

rigger.Light = function(type) {
	 /* The type of light
	  * 0 = Fresnel; 1 = PC; 2 = Parcan; 3 = Flood, 4 = Source 4
	  * argument type can also be a string, but it is converted and stored as an integer
	 */
	var type = rigger.h.strToName("lights", type);
	this.type = function(){return type;};

	this.gel = null; // The Gel

	this.barPos = null; // Light's position on the bar

	// The graphics information for displaying the object
	this.g = {
		x : 0,
		y : 0,
		w : 0,
		h : 0,
		i : rigger.assets.sprites.lights[type]
	};
	this.draw = function(){

	};
};



rigger.Gel = function(num, type){
	this.number = function(){return num;};
	var type = rigger.h.strToName("lights", type);
	this.type = function(){return type;};

	var col = rigger.gelRef[num]; // Gets the HEX colour code for the Gel number
	this.colour = function(){return col;};
}


})();