(function(){
"use strict";

/* Some util functions */
Math.clamp = function(num, min, max){ // Keeps a given number in some bounds
	return Math.max(min, Math.min(num, max));
};


var rigger = {

	width : 1000, height : 500,

	LS : {width : 716, height : 409},

	canvas : null, // The canvas object
	ctx : null, // The canvas context

	/* State of the game
	 * -1 = error; 0 = loading; 1 = main menu; 2 = in game; 3 = victory
	*/
	state : 0,

	menuOption : 0, // Currently selected menu option (top to bottom/left to right)

	locked : false, // If locked interaction is disabled


	/* Mapping from the integer representations to the string representations (name)
	 * Running rigger.objs.lights[num] will return the name of the light that num represents
	*/
	objs : {
		rooms : ["annex", "light store", "gel draw"],
		lights : ["fresnel", "pc", "parcan", "source 4", "flood"]
	},

	game : { // Game state references
		player : null, // The current character

		time : 0, // Time since game started

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
			var b = new rigger.Bar();
			for(var i = 0; i <= rigger.settings.barSize; i++){
				if(Math.random() < 0.3){
					b.addLight(new rigger.Light(rigger.def.lights[Math.floor(Math.random()*4)]), i);
				}
			}
			return b;
		},

		defaultCan : function(a){
			var a = a || 12;
			rigger.ctx.globalAlpha = 1;
			rigger.ctx.strokeStyle = "black";
			rigger.ctx.fillStyle = "black";
			rigger.ctx.font = a+"px Helvetica";
			rigger.ctx.textAlign = "start";
			rigger.ctx.textBaseline = "top";
		}
	},

	e : {
		// Update the bits with respect to time
		update : function(dt){
			if(!rigger.locked){
				// Call the event if a key is held down
				for(var i in rigger.keysDown){
					if(rigger.keyAction[i]){
						rigger.keyAction[i].call(rigger, dt);
					}
				}
			}

			/*if(rigger.state === 1){ // Main menu

			}*/


			/* IN GAME */
			if(rigger.state === 2){
				rigger.e.tick(dt); // Update the timer
				// Update the bar
				rigger.game.bar.update();
				rigger.game.target.update();
			}
		},

		// THE drawing function
		draw : function(){
			rigger.ctx.clearRect(0,0, rigger.width, rigger.height); // Clear the screen (blank canvas)
			rigger.h.defaultCan();

			switch(rigger.state){
				case -1 : { // ERROR
					rigger.d.error();
					return;
				}

				case 0 : { // LOADING
					rigger.d.loading();
					return;
				}

				case 1 : { // MAIN MENU
					rigger.d.menu();
					return;
				}

				case 2 : { // IN GAME
					rigger.d.room();

					// Display the time
					rigger.h.defaultCan(20);
					rigger.ctx.textAlign = "right";
					rigger.ctx.fillText("Time: "+(rigger.game.time/1000).toFixed(3), rigger.width - 10, 10);

					switch(rigger.game.menu){
						case 1 : { // Design
							rigger.d.o.design();
						break; }







						case 0 : { // No overlay
							rigger.game.player.draw();
						break; }
					}
				break; }

				case 3 : { // VICTORY
					// Draw the room green for now
					rigger.ctx.fillStyle = "green";
					rigger.ctx.fillRect(0,0, rigger.width, rigger.height);

					rigger.game.bar.draw(); // Draw the bar to show the winning rig


					rigger.h.defaultCan(40);
					rigger.ctx.textBaseline = "bottom";
					rigger.ctx.fillText("Congratulations! You win", rigger.width/10, rigger.height*4/10);

					rigger.ctx.textBaseline = "top";
					rigger.ctx.fillText("In time: "+(rigger.game.time/1000).toFixed(3), rigger.width/10, rigger.height*4/10);

					rigger.ctx.textAlign = "center";
					rigger.ctx.fillStyle = "yellow";
					rigger.ctx.textBaseline = "bottom";
					rigger.ctx.fillText("Play again?", rigger.width/2, rigger.height - rigger.height/10);
				break; }
			}
		},
		tick : function(dt){
			rigger.game.time += dt*1000;
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
				rigger.h.defaultCan(20);
				rigger.ctx.textAlign = "right";
				rigger.ctx.fillText("Light Store \u21D2", rigger.width - 10, 400);
				rigger.game.ladder.draw();
				rigger.game.bar.draw();

			break; }
			case 1 : { // LIGHT STORE
				rigger.h.defaultCan(20);
				rigger.ctx.fillText("Light Store", 20, 10);
				rigger.ctx.fillStyle = "#4775FF";
				rigger.ctx.fillRect(0, rigger.height - rigger.LS.height, rigger.LS.width, rigger.LS.height);
				rigger.ctx.drawImage(rigger.assets.sprites.bg.lampy, 0, rigger.height - rigger.LS.height, rigger.LS.width, rigger.LS.height);

				// Put in some lights
				var l = rigger.def.lights,
				ln = rigger.LS.width/2, // Length of the lighting bars
				wI = rigger.LS.width/36, // Padding from the side
				wG = ln/l.length, // Space for each light type
				hI = (rigger.height - rigger.LS.height) + rigger.LS.height/13.6, // Top padding
				hG = rigger.LS.height/4.5; // Distance between each bar
				for(var i = 0; i < l.length; i++){
					for(var j = 0; j < 4 /* Number of bars */; j++){
						rigger.ctx.drawImage(l[i].img(), wI + (wG*i), hI + (hG*j), l[i].w, l[i].h);
					}
				}

			break; }


			}
		},
		o : { // Overlays/menus
			design : function(){
				rigger.h.defaultCan(24);
				rigger.ctx.fillStyle = "brown";
				rigger.ctx.fillRect(0,0, rigger.width, rigger.height);

				rigger.game.target.draw();

				rigger.ctx.fillStyle = "black";
				rigger.ctx.fillText("Design", 250, 400);
			},

		},
		error : function(){
			rigger.ctx.fillStyle = "green";
			rigger.ctx.fillRect(0,0, rigger.width, rigger.height);
			rigger.h.defaultCan(20);
			rigger.ctx.textBaseline = "bottom";
			rigger.ctx.fillText("Oh PANTS.", 10, 200);
			rigger.ctx.textBaseline = "top";
			rigger.ctx.fillText("An error has occurred, see the console for more info", 25, 205);
		},
		loading : function(){
			rigger.ctx.fillStyle = "green";
			rigger.ctx.fillRect(0,0, rigger.width, rigger.height);
			rigger.h.defaultCan(24);
			rigger.ctx.textBaseline = "bottom";
			rigger.ctx.fillText("LOADING...", 20, 200);

			rigger.ctx.clearRect(20, 205, 200, 20);
			rigger.ctx.fillRect(20, 205, rigger.assets.loaded*2, 20);
		},
		menu : function(){
			rigger.ctx.fillStyle = "green";
			rigger.ctx.fillRect(0,0, rigger.width, rigger.height);
			// Welcome message
			rigger.h.defaultCan(24);
			rigger.ctx.fillText("Welcome to Rigger!", 20, 10);


			/*var ops = ["New Game", "Nothing", "More Nothing"]; // Game options
			for(var i = 0; i < ops.length; i++){
				rigger.ctx.fillStyle = (i === rigger.menuOption)?"yellow":"black";
				rigger.h.defaultCan(24);
				rigger.ctx.fillText(ops[i], 10, 150 + (50*i));
			}*/

			rigger.ctx.textAlign = "center";
			rigger.ctx.textBaseline = "bottom";
			rigger.ctx.fillText("Pick a character", rigger.width/2, rigger.height/5);

			// Set sizes
			rigger.h.defaultCan(18);
			rigger.ctx.textAlign = "center";

			// Details
			var top = rigger.height/5, // Top of the images
			num = Object.keys(rigger.def.players).length, // Number of players
			hei = rigger.height - top - rigger.height/10; // Height of the image

			// Loop around all the players
			var count = 0;
			for(var n in rigger.def.players){
				var p = rigger.def.players[n],
				wid = p.w*(hei/p.h), // Width of the image, taken from the first image's height
				padding = (rigger.width - (wid*num))/num, // Padding (this is the bit that varies)
				size = [wid, hei],
				pos = [padding/2 + padding*count + size[0]*count, top];


				if(count === rigger.menuOption){
					rigger.ctx.globalAlpha = 0.5;
					rigger.ctx.fillStyle = "yellow";
					rigger.ctx.fillRect(pos[0], pos[1], size[0], size[1])
					rigger.ctx.globalAlpha = 1;
				}else{
					rigger.ctx.fillStyle = "black";
				}
				rigger.ctx.drawImage(p.imgs.front, pos[0], pos[1], size[0], size[1]);

				rigger.ctx.fillText(p.name, pos[0] + size[0]/2, pos[1] + size[1] + 10);

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

		// Create a new ladder
		rigger.game.ladder = new rigger.Ladder();


		rigger.locked = false; // Unlock if locked
		rigger.game.menu = 0;

		rigger.game.time = 0; // Reset timer
		// Set inGame
		rigger.state = 2;
	},

	pause : function(){

	}

};


rigger.init = function(div, w, h){
	if(!div){throw new Error("Where do I put my canvas?!");}
	if(w && h){
		rigger.width = w; rigger.height = h;
		rigger.LS.width = w/1.396; rigger.LS.height = h/1.222; // Ratio's for the lighting store
	}
	// Create the canvas object
	var canvas = document.createElement("canvas"),
	    ctx = canvas.getContext("2d");
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
