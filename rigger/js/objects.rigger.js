// Contains the objects used in the game
(function(){

rigger.Player = function(who){
	this.who = function(){return who;};

	this.speed = 300; // Speed in px/s

	this.light = null; // Holding a light?

	this.hand = { // Position relative to the image of the players hand
		x : 0,
		y : 0
	};

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

		// Draw light if needed
		if(this.light){
			this.light.draw();
		}
	};
	this.update = function(dt, key){
		if(key === 37 || key === 39){ // Left or right
			var min = 0; var max = rigger.width - this.g.w;
			if(this.g.y < rigger.height - this.g.h){ // No moving away from the ladder if in the air
				min = rigger.game.ladder.g.x; max = rigger.game.ladder.g.x + rigger.game.ladder.g.w;
			}
			this.g.x = Math.clamp(this.g.x + (this.speed * (dt * (key - 38) /*Clever directional trick*/)), min, max);
		}else{
			if(key === 38 || key === 40){ // Up or Down
				if(rigger.game.player.g.x > rigger.game.ladder.g.x && rigger.game.player.g.x < rigger.game.ladder.g.x + rigger.game.ladder.g.w){ // Over the ladder
					this.g.y = Math.clamp(this.g.y + (this.speed * (dt * (key - 39) /*Clever directional trick*/)), rigger.game.ladder.g.y, rigger.height - this.g.h);
				}
			}
		}

		if(this.light){
			// Place the light in his hand
			//this.light.g.x = fg;
		}
	};
};

rigger.Bar = function(){ // Represents a bar in the annex
	this.bar = (function(b){var a = []; while(a.length < b){a.push(false)} return a;})(rigger.settings.barSize); // Create an array of 20 false values (false means empty)

	var updatables = {}; // What needs updating on the bar (what's new cockadoo?)

	// Please use these methods for adding & removing lights!
	this.addLight = function(light, pos){
		if(!light || !pos || pos >= rigger.settings.barSize){return;}
		if(this.bar[pos]){return;} // Already got a light there
		this.bar[pos] = light;
		updatables[pos] = true;
	};
	this.removeLight = function(pos){
		if(!pos || pos >= rigger.settings.barSize){return;}
		if(!this.bar[pos]){return;} // No light there
		var light = this.bar[pos];
		this.bar[pos] = false;
		updatables[pos] = true;

		return light;
	};

	this.g = {
		x : 0,
		y : 50,
		w : 5 // Thickness of the bar
	};
	this.draw = function(){
		rigger.ctx.strokeStyle = "black";
		rigger.ctx.lineWidth = this.g.w;

		rigger.ctx.beginPath();
		rigger.ctx.moveTo(this.g.x, this.g.y);
		rigger.ctx.lineTo(rigger.width, this.g.y);
		rigger.ctx.stroke();

		this.bar.forEach(function(a){
			if(a){a.draw()}
		});
	};
	this.update = function(dt){
		for(var u in updatables){
			// Update the lights on bar
			/* Divide up the bar per (size:positions)
			 * Position relative (position * ratio)
			 * Move the light onto the bar
			 */
			var ratio = rigger.width/rigger.settings.barSize; // Divide up the bar
			var absPos = u * ratio; // Absolute position

			this.bar[u].g.x = absPos;
			this.bar[u].g.y = this.g.y+1;

			delete updatables[u]; // Been updated bro
		}
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
		w : 50,
		h : 50,
		i : rigger.assets.sprites.lights[type]
	};
	this.draw = function(){
		rigger.ctx.fillStyle = "purple";
		rigger.ctx.fillRect(this.g.x, this.g.y, this.g.w, this.g.h);
	};
};



rigger.Gel = function(num, type){
	this.number = function(){return num;};
	var type = rigger.h.strToName("lights", type);
	this.type = function(){return type;};

	var col = rigger.gelRef[num]; // Gets the HEX colour code for the Gel number
	this.colour = function(){return col;};
};


rigger.Ladder = function(){

	this.position = 0;

	this.g = {
		w : 100,
		h : 400,
		x : 0
	};
	this.g.y = rigger.height - this.g.h;

	this.draw = function(){
		var rW = this.g.w/5
		rigger.ctx.lineWidth = rW;
		rigger.ctx.strokeStyle = "gray";

		// Left
		rigger.ctx.beginPath();
		rigger.ctx.moveTo(this.g.x, this.g.y);
		rigger.ctx.lineTo(this.g.x, rigger.height);
		rigger.ctx.stroke();

		// Right
		rigger.ctx.beginPath();
		rigger.ctx.moveTo(this.g.x + this.g.w - rW, this.g.y);
		rigger.ctx.lineTo(this.g.x + this.g.w - rW, rigger.height);
		rigger.ctx.stroke();

		// Rungs
		var num = this.g.h/7; // 20 rungs
		for(var i = 0; i < 7; i++){
			rigger.ctx.beginPath();
			rigger.ctx.moveTo(this.g.x, this.g.y + (num * i));
			rigger.ctx.lineTo(this.g.x + this.g.w, this.g.y + (num * i));
			rigger.ctx.stroke();
		}
	};
	this.update = function(){

	};
};


})();