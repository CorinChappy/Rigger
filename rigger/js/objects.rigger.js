// Contains the objects used in the game
(function(){
"use strict";

rigger.Player = function(who){
	this.who = function(){return who;};

	this.speeds = who.speeds;
	this.speed = who.speeds[0]; // Speed in px/s

	this.light = null; // Holding a light?

	this.hand = { // Position relative to the image of the players hand
		x : 30,
		y : 50
	};

	this.imgs = who.imgs;

	this.g = {
		w : who.w,
		h : who.h,
		x : 0,
		y : 0,
		i : this.imgs.left,
		cI : true, // Image flipper
		cD : 1
	};
	this.g.y = rigger.height - this.g.h;
	this.g.x = rigger.width - this.g.w - 5;
};
/* Prototype methods for player */
rigger.Player.prototype.draw = function(){
	rigger.ctx.drawImage(this.g.i, this.g.x, this.g.y, this.g.w, this.g.h);

	// Draw light if needed
	if(this.light){
		this.light.draw();
	}
};
rigger.Player.prototype.update = function(dt, key){
		switch(key){
			// Left or right
			case 37 :
			case 39 : {
			// Boundaries for the rooms
			var min, max;
			if(rigger.game.room === 0){
				min = 0 - this.g.w*2/3;
				max = rigger.width - this.g.w;
			}else{
				min = min = 0;
				max = rigger.LS.width - this.g.w/3;
			}

			if(this.g.y >= rigger.height - this.g.h){ // No moving away from the ladder if in the air
				this.g.x = Math.clamp(this.g.x + (this.speed * (dt * (key - 38) /*Clever directional trick*/)), min, max);
				this.g.i = (key === 39)?this.imgs.right:this.imgs.left;
			}
			break; }

			// Up or Down
			case 38 :
			case 40 : { if(rigger.game.room !== 0){break;} // Not on the ANNEX
				var l = rigger.game.ladder.g,
					rW = l.w/5;
				if(rigger.game.player.g.x > l.x && rigger.game.player.g.x < l.x + l.w - (rW*4)){ // Over the ladder
					this.g.y = Math.clamp(this.g.y + (this.speed * (dt * (key - 39) /*Clever directional trick*/)), l.y, rigger.height - this.g.h);
					this.g.cD = this.g.cD - dt * 4;
					if(this.g.cD <= 0){
						this.g.cI = !this.g.cI;
						this.g.cD = 1;
					}
					this.g.i = (this.g.cI)?this.imgs.climb:this.imgs.climb2;
				}
			break; }

			// Spacebar
			case 32 : {
				if(rigger.game.room === 0){ // ANNEX
					var b = rigger.game.bar;
					// Check you are close enough to the bar (top of the ladder)
					if(this.g.y === rigger.game.ladder.g.y){
						// Check colision with bar position
						var ratio = rigger.width/rigger.settings.barSize,
							u = Math.floor((this.g.x + (ratio/2))/ratio);
						if(this.light){
							// Try to add to the bar
							if(b.addLight(this.light, u)){
								this.light = null;
								this.speed = this.speeds[0];
							}
						}else{
							this.light = b.removeLight(u); // Get a light if you are not holding one
						}
					}
				}
				if(rigger.game.room === 1){ // LIGHT STORE
					if(this.g.x < rigger.LS.width*0.2 && this.light){ // Over the gels draw
						rigger.menuOption = 0;
						rigger.game.menu = 3;
					}else{
						var ll = rigger.def.lights.length, // Number of light types
						ln = rigger.LS.width/2, // Length of the lighting bars
						wI = rigger.LS.width/12, // Padding from the side
						wG = ln/ll; // Space for each light type
						if(this.g.x > (rigger.LS.width - ln) - wG/2 && this.g.x < rigger.LS.width - wI){ // Over the lighting part
							var t = Math.floor(((rigger.LS.width - this.g.x - wI) + wG/2)/wG);
							if(this.light){
								if(t === this.light.type().t){
									this.light = null;
									this.speed = this.speeds[0];
								}
							}else{
								try{
									this.light = new rigger.Light(rigger.def.lights[t]);
								}catch(e){}
							}
						}
					}
				}
			break; }
		}



		if(this.light){
			this.speed = this.speeds[3];
			// Place the light in his hand
			this.light.g.x = this.g.x + this.hand.x;
			this.light.g.y = this.g.y + this.hand.y;
		}
};




rigger.Bar = function(design){ // Represents a bar in the annex (design is a boolean, whether or not it's a physical bar, or one drawn on paper)
	this.bar = (function(b){var a = []; while(a.length < b){a.push(false);} return a;})(rigger.settings.barSize); // Create an array of 20 false values (false means empty)
	this.design = design;

	var updatables = {}; // What needs updating on the bar (what's new cockadoo?)

	// Please use these methods for adding & removing lights!
	this.addLight = function(light, pos){
		if(!light || pos < 0 || pos >= rigger.settings.barSize){return false;}
		if(this.bar[pos]){return false;} // Already got a light there
		this.bar[pos] = light;
		updatables[pos] = true;

		return true;
	};
	this.removeLight = function(pos){
		if(pos < 0 || pos >= rigger.settings.barSize){return;}
		if(!this.bar[pos]){return null;} // No light there
		var light = this.bar[pos];
		this.bar[pos] = false;

		return light;
	};

	this.g = {
		x : 0,
		y : 50,
		t : 5, // Thickness of the bar
		l : rigger.width // Length of the bar
	};

	this.update = function(dt){
		for(var u in updatables){
			// Update the lights on bar
			/* Divide up the bar per (size:positions)
			 * Position relative (position * ratio)
			 * Move the light onto the bar
			 */
			var ratio = this.g.l/rigger.settings.barSize, // Divide up the bar
				absPos = u * ratio; // Absolute position

			this.bar[u].g.x = absPos;
			this.bar[u].g.y = this.g.y+1;

			delete updatables[u]; // Been updated bro
		}
	};
};
/* Bar prototypes */
rigger.Bar.prototype.draw = function(){
	rigger.ctx.strokeStyle = "black";
	rigger.ctx.lineWidth = this.g.t;

	rigger.ctx.beginPath();
	rigger.ctx.moveTo(this.g.x, this.g.y);
	rigger.ctx.lineTo(this.g.x + this.g.l, this.g.y);
	rigger.ctx.stroke();

	this.bar.forEach(function(a){
		if(a){
			a.draw();
			if(this.design && a.gel){
				var num = a.gel.number();
				rigger.h.defaultCan();
				rigger.ctx.textBaseline = "bottom";
				rigger.ctx.textAlign = "center";
				rigger.ctx.fillText(num, a.g.x + a.g.w/2, a.g.y - 10);
			}
		}
	}.bind(this));
};
rigger.Bar.equals = function(a, b){ // Check for equality of two bars
	if(!a || !b){return false;}
	for(var i = 0; i < rigger.settings.barSize; i++){
		if(!rigger.Light.equals(a.bar[i], b.bar[i])){return false;}
	}
	return true;
};





rigger.Light = function(type){
	if(!type){throw new Error();}
	this.type = function(){return type;};

	this.gel = null; // The Gel
	this.gelPos = type.gelPos;

	this.barPos = null; // Light's position on the bar

	// The graphics information for displaying the object
	this.g = {
		x : 0,
		y : 0,
		w : type.w,
		h : type.h,
		i : type.img()
	};
};
/* Light prototypes */
rigger.Light.prototype.draw = function(){
		rigger.ctx.drawImage(this.g.i, this.g.x, this.g.y, this.g.w, this.g.h);
		if(this.gel){
			rigger.ctx.fillStyle = this.gel.colour();
			rigger.ctx.globalAlpha = 0.8;
			rigger.ctx.fillRect(this.g.x + this.gelPos.x, this.g.y + this.gelPos.y, this.gelPos.w, this.gelPos.h);
		}
};
rigger.Light.prototype.addGel = function(gelRef){
	try{
		this.gel = new rigger.Gel(gelRef);
	}catch(e){
		this.gel = null;
	}
};
rigger.Light.equals = function(a, b){
	if(!a || !b){return (!a && !b);} // Two falsy values (nulls) are the same, one fasly value is not good
	if(a.type() !== b.type()){return false;}
	if(!rigger.Gel.equals(a.gel, b.gel)){return false;}
	return true;
};



rigger.Gel = function(num){
	if(!rigger.gelRef[num]){throw new Error();}
	this.number = function(){return num;};

	var col = rigger.gelRef[num]; // Gets the HEX colour code for the Gel number
	this.colour = function(){return col;};
};
rigger.Gel.equals = function(a, b){
	if(!a || !b){return (!a && !b);} // Two falsy values (nulls) are the same, one fasly value is not good
	if(a.colour() !== b.colour()){return false;}
	return true;
};


rigger.Ladder = function(){

	this.position = 0;

	this.g = {
		w : 75,
		h : rigger.height * 0.95
	};
	this.g.y = rigger.height - this.g.h;
	this.g.x = rigger.width - this.g.w - 50;
};

rigger.Ladder.prototype.draw = function(){
	rigger.h.defaultCan();
	rigger.ctx.drawImage(rigger.assets.sprites.misc.ladder, this.g.x, this.g.y, this.g.w, this.g.h);
};
rigger.Ladder.prototype.update = function(){
	/* Check colision with player */
	var p = rigger.game.player,
		rW = this.g.w/5;
	if(p.g.y === rigger.height - p.g.h // Player on ground
	&& p.g.x > this.g.x - (rW*2) && p.g.x < this.g.x + this.g.w - (rW*2) // Player over the ladder
	&& !p.light){ // Player has not got a light
		// Move ladder with player
		this.g.x = p.g.x - rW/2;
	}

};


})();
