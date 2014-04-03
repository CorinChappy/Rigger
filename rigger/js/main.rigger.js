(function(){
"use strict";

/* Some util functions */
Math.clamp = function(num, min, max){ // Keeps a given number in some bounds
	return Math.max(min, Math.min(num, max));
};


var rigger = {

	width : 1000, height : 500,

	canvas : null, // The canvas object
	ctx : null, // The canvas context

	/* State of the game
	 * -1 = error; 0 = loading; 1 = main menu; 2 = in game
	*/
	state : 0,

	menuOption : 0, // Currently selected menu option (top to bottom)

	locked : false, // If locked interaction is disabled


	/* Mapping from the integer representations to the string representations (name)
	 * Running rigger.objs.lights[num] will return the name of the light that num represents
	*/
	objs : {
		rooms : ["annex", "light store", "gel draw"],
		lights : ["fresnell", "pc", "parcan", "source 4", "flood"]
	},

	game : { // Game state references
		player : null, // The current character

		/* Current room
		 * 0 = Annex; 1 = Light Store; 2 = Gel Draw
		*/
		room : 0,

		/* Currently displayed menu overlay
		 * 0 = none; 1 = design; 2 = in game menu
		*/
		menu : 0,

		ladder : null,

		bar : null, // The bar's current state

		target : null // The target bar
	},

	/* Global settings for the game */
	settings : {
		barSize : 20, // Size of the bars
		volume : 1 // Volume for sound effects (0-1)

	},
	

	// Helper functions
	h : {
		// String of the obj to it's int value
		strToName : function(s, t){
			if(parseInt(t) % 1 === 0){
				return (t >= rigger.objs[s].length || t < 0)?0:t;
			}
			var index = rigger.objs[s].indexOf(t);
			return (index < 0)?0:index;
		},

		// Generate a random bar
		genBar : function(){
			return new rigger.Bar();
		}
	},

	e : {
		// Update the bits with respect to time
		update : function(dt){
			if(!this.locked){
				// Call the event if a key is held down
				for(var i in rigger.keysDown){
					if(rigger.keyAction[i]){
						rigger.keyAction[i].call(rigger, dt);
					}
				}
			}

			if(rigger.state === 1){ // Main menu

			}


			/* IN GAME */
			if(rigger.state === 2){
				// Update the bar
				rigger.game.bar.update();
			}
		},

		// THE drawing function
		draw : function(){
			rigger.ctx.clearRect(0,0, rigger.width, rigger.height); // Clear the screen (blank canvas)
			rigger.d.room();

			if(rigger.state === -1){ // ERROR
				rigger.d.error();
				return;
			}

			if(rigger.state === 0){ // LOADING
				rigger.d.loading();
				return;
			}

			if(rigger.state === 1){ // MAIN MENU
				rigger.d.menu();
				return;
			}

			if(rigger.state === 2){ // IN GAME
				if(rigger.game.room === 0){ // We are in the ANNEX
					rigger.game.ladder.draw();
					rigger.game.bar.draw();
				}


				rigger.game.player.draw();
			}
		}
	},

	// Misc drawing functions
	d : {
		room : function(){
			switch(rigger.game.room){
			case 0 : { // ANNEX
				// Draw the room green for now
				rigger.ctx.fillStyle = "green";
				rigger.ctx.fillRect(0,0, rigger.width, rigger.height);
			break; }
			case 1 : { // LIGHT STORE
				rigger.ctx.fillStyle = "#4775FF";
				rigger.ctx.fillRect(0, rigger.height*2/10, rigger.width*7/10, rigger.height*8/10);
				rigger.ctx.fillStyle = "black";
				rigger.ctx.font = "20px Helvetica";
				rigger.ctx.textBaseline = "top";
				rigger.ctx.fillText("Light Store", 20, 10);
			break; }


			}
		},
		error : function(){
			rigger.ctx.fillStyle = "black";
			rigger.ctx.font = "20px Helvetica";
			rigger.ctx.textBaseline = "bottom";
			rigger.ctx.fillText("Oh PANTS.", 10, 200);
			rigger.ctx.textBaseline = "top";
			rigger.ctx.fillText("An error has occurred, see the console for more info", 25, 205);
		},
		loading : function(){
			rigger.ctx.fillStyle = "black";
			rigger.ctx.font = "24px Helvetica";
			rigger.ctx.textBaseline = "bottom";
			rigger.ctx.fillText("LOADING...", 20, 200);

			rigger.ctx.clearRect(20, 205, 200, 20);
			rigger.ctx.fillRect(20, 205, rigger.assets.loaded*2, 20);
		},
		menu : function(){
			// Welcome message
			rigger.ctx.fillStyle = "black";
			rigger.ctx.font = "24px Helvetica";
			rigger.ctx.textBaseline = "top";
			rigger.ctx.textAlign = "start";
			rigger.ctx.fillText("Welcome to Rigger!", 20, 10);


			/*var ops = ["New Game", "Nothing", "More Nothing"]; // Game options
			for(var i = 0; i < ops.length; i++){
				rigger.ctx.fillStyle = (i === rigger.menuOption)?"yellow":"black";
				rigger.ctx.font = "24px Helvetica";
				rigger.ctx.textBaseline = "top";
				rigger.ctx.fillText(ops[i], 10, 150 + (50*i));
			}*/

			rigger.ctx.textAlign = "center";
			rigger.ctx.fillText("Pick a character", rigger.width/2, 100);

			// Loop around all the players
			var count = 0;
			for(var n in rigger.def.players){
				var p = rigger.def.players[n], size = [p.w*3, p.h*3],
				pos = [250 + (size[0]*9/5)*count, 150];

				if(count === rigger.menuOption){
					rigger.ctx.globalAlpha = 0.5;
					rigger.ctx.fillStyle = "yellow";
					rigger.ctx.fillRect(pos[0], pos[1], size[0], size[1])
					rigger.ctx.globalAlpha = 1;
				}
				rigger.ctx.drawImage(p.imgs.front, pos[0], pos[1], size[0], size[1]);

				count++;
			}
		}

	},



	newGame : function(player){
		var p = player || rigger.def.players.danbarr; // danbarr is the default player
		rigger.game.player = new rigger.Player(p);

		// Generate a random target bar
		rigger.game.target = rigger.h.genBar();
		// Create the new, empty bar
		rigger.game.bar = new rigger.Bar();
		for(var i = 0; i <= rigger.settings.barSize; i++){
			if(Math.random() < 0.5){
				rigger.game.bar.addLight(new rigger.Light(rigger.def.lights[Math.floor(Math.random()*4)]), i);
			}
		}

		// Create a new ladder
		rigger.game.ladder = new rigger.Ladder();


		// Set inGame
		rigger.state = 2;
	},

	pause : function(){

	}

};


rigger.init = function(div){
	// Create the canvas object
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = rigger.width;
	canvas.height = rigger.height;
	div.appendChild(canvas);
	rigger.canvas = canvas;
	rigger.ctx = ctx;



	// Create gameloop etc.
	gameloop(function(dt){
		// Do shizz
		rigger.e.update(dt);
		rigger.e.draw();
	});


	// Load the assets
	rigger.assets.load(function(load, t){
		if(load === true){ // Check for success (strictly)
			rigger.state = 1; // Show the main menu, let's play!
		}else{
			rigger.state = -1;
			throw new Error("Asset \""+t+"\" couldn't load :(");
		}

	});
};


// Export rigger object for the rest of the JS
window.rigger = rigger;
})();


// INIT on load, rigger gets replaced to become an obj after it is called
window.addEventListener("load",function(){
	rigger.init(document.getElementById("game"));
});
