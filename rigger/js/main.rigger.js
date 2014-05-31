(function(){
"use strict";

/* Import fonts from Google fonts */
window["WebFontConfig"] = {};
window["WebFontConfig"]["google"] = {};
window["WebFontConfig"]["google"]["families"] = [
	'Press+Start+2P::latin' // By: CodeMan38,  http://www.google.com/fonts/#QuickUsePlace:quickUse/Family:Press+Start+2P
];
(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
		'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();

/* Some util functions */
Math.clamp = function(num, min, max){ // Keeps a given number in some bounds
	return Math.max(min, Math.min(num, max));
};
// Vendor prefix independent function to check if the tab/page is hidden
// Adpated from: http://www.html5rocks.com/en/tutorials/pagevisibility/intro/
var pageHidden = (function(){
	var prop = (function(){
		var prefixes = ["webkit","moz","ms","o"];
		if ("hidden" in document) return "hidden";

		for (var i = 0; i < prefixes.length; i++){
			if ((prefixes[i] + "Hidden") in document){
				return prefixes[i] + "Hidden";
			}
		}
		return null;
	})();
	
	if (!prop){
		return function(){return false;};
	}
	return function(){return document[prop];};
})();




/* Game functions */
function startGameloop(){
	// Create gameloop etc.
	var reqAnimFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		(function(){
			throw new Error("Game not supported in this browser/version: No support for rAF");
		})();
	var last = null;
	var cb = function(ts){
		var dt = Math.min(80, (ts - last))/1000;
		last = ts;
		// Do shizz
		rigger.e.update(dt);
		rigger.e.draw();
		reqAnimFrame(cb);
	};
	reqAnimFrame(function(ts){
		last = ts;
		cb(ts);
	});
}
function showCharacter(p, top, num, hei, count){
	var wid = p.w*(hei/p.h), // Width of the image, taken from the first image's height
	padding = (rigger.width - (wid*num))/num, // Padding (this is the bit that varies)
	size = [wid, hei],
	pos;

	if(count >= 6){
		pos = [padding/2 + padding*(count-6) + size[0]*(count-6), top + hei + 30];
	}else{
		pos = [padding/2 + padding*count + size[0]*count, top];
	}


	if(count === rigger.menuOption){
		rigger.ctx.globalAlpha = 0.5;
		rigger.ctx.fillStyle = "blue";
		rigger.ctx.fillRect(pos[0], pos[1], size[0], size[1]);
		rigger.ctx.globalAlpha = 1;
	}else{
		rigger.ctx.fillStyle = "black";
	}
	rigger.ctx.drawImage(p.imgs.front, pos[0], pos[1], size[0], size[1]);

	rigger.ctx.fillText(p.name, pos[0] + size[0]/2, pos[1] + size[1] + 10);
}


var rigger = {

	width : 1000, height : 500,

	LS : {width : 716, height : 409},

	canvas : null, // The canvas object
	ctx : null, // The canvas context

	/* State of the game
	 * -1 = error; 0 = loading; 1 = main menu; 2 = in game; 3 = victory; 4 = failure; 5 = instructions
	*/
	state : 0,

	menuOption : 0, // Currently selected menu option (top to bottom/left to right)

	locked : false, // If locked interaction is disabled


	game : { // Game state references
		player : null, // The current character

		time : 0, // Time since game started

		/* Current room
		 * 0 = Annex; 1 = Light Store;
		*/
		room : 0,

		/* Currently displayed menu overlay
		 * 0 = none; 1 = design; 2 = in game menu; 3 = Gel Draw
		*/
		menu : 0,

		instructions : true, // Whether to display the instructions

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
		// Generate a random bar
		genBar : function(design){
			var b = new rigger.Bar(design === true),
			l, k;
			for(var i = 0; i <= rigger.settings.barSize; i++){
				if(Math.random() < 0.3){
					l = new rigger.Light(rigger.def.lights[Math.floor(Math.random()*rigger.def.lights.length)]);
					if(Math.random() < 0.3){
						k = Object.keys(rigger.gelRef);
						l.addGel(k[Math.floor(Math.random()*k.length)]);
					}
					b.addLight(l, i);
				}
			}
			return b;
		},

		timeConvert : function(t, p){ // Takes the time (ms) and converts it into a time of day (p represents need for second presistion)
			var startTime = [15,0];
			// 1 sec = 1 min
			var s = Math.floor(t/1000), // Secs
				hours = Math.floor(s/60),
				mins = s % 60;

			var a = startTime[0]+hours,
				b = startTime[1]+mins;

			a -= 24*Math.floor(a/24);
			b = ((b > 9)?b:(0).toString()+b);

			var m;
			if(a < 12){
				m = "am";
			}else{
				m = "pm";
				a -= 12;
			}


			var str = a + ":" + b;
			if(p){
				str += ":" + ((t%1000)/10).toFixed(0);
			}
			return str + m;
		},

		defaultCan : function(a){
			rigger.ctx.restore();
			rigger.ctx.save();
			if(a % 1 === 0){
				rigger.ctx.font = a+"px 'Press Start 2P' Helvetica";
			}
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

			switch(rigger.state){
				case 2 : { // IN GAME
					// Update the bar
					rigger.game.bar.update();
					rigger.game.target.update();


					if(rigger.game.menu !== 2){ // Do not update on pause/game menu
						rigger.e.tick(dt); // Update the timer
					}
					// Check for failure conditions
					if(rigger.game.time > 480000){ // 480000ms = 480s = 8 minutes = 8 hours in gametime (IE failure is at 11pm)
						rigger.state = 4;
						rigger.emmitEvent("failure");
					}
				break; }

				case 3 : {
					rigger.game.bar.update();
				}
			}
		},

		// THE drawing function
		draw : function(){
			rigger.ctx.clearRect(0,0, rigger.canvas.width, rigger.canvas.height); // Clear the screen (blank canvas)
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
					rigger.ctx.fillText(""+rigger.h.timeConvert(rigger.game.time), rigger.width - 10, 10);

					switch(rigger.game.menu){
						case 1 : { // Design
							rigger.d.o.design();
						break; }

						case 2 : { // In game menu/paused
							rigger.game.player.draw();
							rigger.d.o.inGame();
						break; }

						case 3 : { // Gel draw
							rigger.game.player.draw();
							rigger.d.o.gels();
						break; }



						case 0 : { // No overlay
							rigger.game.player.draw();
						break; }
					}
				break; }

				case 3 : { // VICTORY
					rigger.d.o.victory();
				break; }

				case 4 : { // FAILURE
					rigger.d.o.failure();
				break; }

				case 5 : { // INSTRUCTIONS
					rigger.d.instructions();
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
				rigger.ctx.drawImage(rigger.assets.sprites.bg.annex, 0,0, rigger.width, rigger.height);

				if(rigger.game.instructions){
					/* Draw the instructions */
					rigger.h.defaultCan(21);
					rigger.ctx.fillStyle = "white";
					rigger.ctx.textAlign = "center";
					rigger.ctx.fillText("\u21E6 \u21E7 \u21E8 \u21E9 move", rigger.width/2, rigger.height*9/20);
					rigger.h.defaultCan(18);
					rigger.ctx.fillStyle = "white";
					rigger.ctx.textAlign = "center";
					rigger.ctx.fillText("Hold Space to move the ladder", rigger.width/2, rigger.height*11/20);
					rigger.ctx.fillText("Space rigs and derigs a light", rigger.width/2, rigger.height*13/20);
					rigger.ctx.fillText("D shows/hides the lighting design", rigger.width/2, rigger.height*15/20);
				}

				rigger.game.ladder.draw();
				rigger.game.bar.draw();

			break; }
			case 1 : { // LIGHT STORE
				rigger.h.defaultCan(20);
				rigger.ctx.fillText("Light Store", 20, 10);
				rigger.ctx.fillStyle = "#4775FF";
				rigger.ctx.fillRect(0, rigger.height - rigger.LS.height, rigger.LS.width, rigger.LS.height);
				rigger.ctx.drawImage(rigger.assets.sprites.bg.lampy, 0, rigger.height - rigger.LS.height, rigger.LS.width, rigger.LS.height);

				/* Instructions */
				if(rigger.game.instructions){
					rigger.h.defaultCan(16);
					rigger.ctx.textAlign = "center";
					rigger.ctx.fillText("Press Space to pick up a light!", rigger.width/2, rigger.height*3/20);
					rigger.h.defaultCan(11);
					rigger.ctx.textBaseline = "bottom";
					rigger.ctx.fillText("Press Space", 0, rigger.height - rigger.LS.height*2/5);
					rigger.ctx.fillText("your light", 0, rigger.height - rigger.LS.height/3 - 5);
					rigger.ctx.textBaseline = "top";
					rigger.ctx.fillText("here to gel \u21E9", 0, rigger.height - rigger.LS.height*2/5);
				}

				// Put in some lights
				var l = rigger.def.lights,
				ln = rigger.LS.width/2, // Length of the lighting bars
				wI = rigger.LS.width/12, // Padding from the side
				wG = ln/l.length, // Space for each light type
				hI = (rigger.height - rigger.LS.height) + rigger.LS.height/13.6, // Top padding
				hG = rigger.LS.height/4.5; // Distance between each bar
				for(var i = 0; i < l.length; i++){
					for(var j = 0; j < 4 /* Number of bars */; j++){
						rigger.ctx.drawImage(l[i].img(), rigger.LS.width - wI - (wG*i), hI + (hG*j), l[i].w, l[i].h);
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
			inGame : function(){
				rigger.h.defaultCan();
				// Transparent layer
				rigger.ctx.globalAlpha = 0.5;
				rigger.ctx.fillStyle = "white";
				rigger.ctx.fillRect(0, 0, rigger.width, rigger.height);


				rigger.h.defaultCan(24);
				rigger.ctx.textAlign = "center";
				rigger.ctx.fillText("Game Paused...", rigger.width/2, rigger.height/5);
			},
			gels : function(){
				rigger.ctx.globalAlpha = 0.9;
				rigger.ctx.fillStyle = "white";
				rigger.ctx.fillRect(0, 0, rigger.width, rigger.height);




				// Do some maths
				var gelsNos = Object.keys(rigger.gelRef).sort();
				var cols = 7,
				rows = 7,
				padd = [rigger.width/20, rigger.height/20],
				size = [(rigger.width - (padd[0]*cols))/cols, (rigger.width - (padd[0]*rows))/rows];


				/* Instructions */
				rigger.h.defaultCan(21);
				rigger.ctx.textBaseline = "bottom";
				if(rigger.menuOption === 0){
					rigger.ctx.fillText("Pick a gel.", rigger.width/4, rigger.height - rigger.LS.height);
				}else{
					rigger.ctx.fillText("Pick a gel. Selected: "+gelsNos[rigger.menuOption - 1], rigger.width/4, rigger.height - rigger.LS.height);
				}



				rigger.h.defaultCan(18);
				rigger.ctx.textAlign = "center";
				rigger.ctx.textBaseline = "middle";
				rigger.ctx.lineWidth = 5;
				// Draw a square grid

				/* Draw the 'none' section */
				rigger.ctx.fillText("None", padd[0]/2 + (size[0]/2), (rigger.height - rigger.LS.height) + padd[1]/2 + (size[1]/2));
				if(rigger.menuOption === 0){
					rigger.ctx.strokeRect(padd[0]/2, padd[1]/2 + (rigger.height - rigger.LS.height), size[0], size[1]);
				}
				rigger.ctx.globalAlpha = 0.8;
				main : for(var i = 0; i < rows; i++){
					var j = (i === 0)?1:0;
					for(; j < cols; j++){
						var gelNo = (i*cols + j) - 1;
						if(gelsNos.length <= gelNo){break main;}
						rigger.ctx.fillStyle = rigger.gelRef[gelsNos[gelNo]];
						rigger.ctx.fillRect(padd[0]/2 + size[0]*j + padd[0]*j, (rigger.height - rigger.LS.height) + padd[1]/2 + size[1]*i + padd[1]*i, size[0], size[1]);
						if(rigger.menuOption === gelNo+1){
							rigger.ctx.strokeRect(padd[0]/2 + size[0]*j + padd[0]*j, (rigger.height - rigger.LS.height) + padd[1]/2 + size[1]*i + padd[1]*i, size[0], size[1]);
						}
					}
				}


			},
			victory : function(){
				rigger.h.defaultCan();
				rigger.ctx.globalAlpha = 0.5;
				rigger.ctx.drawImage(rigger.assets.sprites.bg.annex, 0,0, rigger.width, rigger.height);

				rigger.h.defaultCan();
				rigger.game.bar.draw(); // Draw the bar to show the winning rig


				rigger.h.defaultCan(40);
				rigger.ctx.textBaseline = "bottom";
				rigger.ctx.fillText("Good job!", rigger.width/10, rigger.height*4/10);

				rigger.h.defaultCan(26);
				rigger.ctx.textBaseline = "top";
				rigger.ctx.fillText("The get in finished at: "+rigger.h.timeConvert(rigger.game.time, true), rigger.width/10, rigger.height*4/10 + 10);

				rigger.ctx.textAlign = "center";
				rigger.ctx.fillStyle = "yellow";
				rigger.ctx.textBaseline = "bottom";
				rigger.ctx.fillText("Play again?", rigger.width/2, rigger.height - rigger.height/8);
			},
			failure : function(){
				rigger.ctx.globalAlpha = 0.5;
				rigger.ctx.drawImage(rigger.assets.sprites.bg.annex, 0,0, rigger.width, rigger.height);

				// Display the time
				rigger.h.defaultCan(20);
				rigger.ctx.textAlign = "right";
				rigger.ctx.fillText(""+rigger.h.timeConvert(rigger.game.time), rigger.width - 10, 10);

				rigger.game.bar.draw(); // Draw the bar to show current rig

				rigger.h.defaultCan(32);
				rigger.ctx.textBaseline = "bottom";
				rigger.ctx.fillText("Security kicked you out", rigger.width/10, rigger.height*4/10);

				rigger.h.defaultCan(18);
				rigger.ctx.textBaseline = "top";
				rigger.ctx.fillText("You should probably get late night", rigger.width/10 + 20, rigger.height*4/10 + 10);
				rigger.ctx.fillText("working next time...", rigger.width/10 + 20, rigger.height*4/10 + 10 + 23);

				rigger.ctx.textAlign = "center";
				rigger.ctx.fillStyle = "yellow";
				rigger.ctx.textBaseline = "bottom";
				rigger.ctx.fillText("Try again?", rigger.width/2, rigger.height - rigger.height/8);
			}
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
		instructions : function(){
			/* More detailed instructions */
			rigger.h.defaultCan(24);
			rigger.ctx.strokeRect(0, 0, rigger.width, rigger.height);
			rigger.ctx.fillText("How to play", 10, 10);
			rigger.ctx.fillText("Detailed instructions coming soon...", 20, 200);
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
			rigger.ctx.globalAlpha = 0.2;
			rigger.ctx.drawImage(rigger.assets.sprites.bg.annex, 0,0, rigger.width, rigger.height);
			
			// Welcome message
			rigger.h.defaultCan(24);
			rigger.ctx.fillText("Welcome to Rigger!", 20, 10);


			// Press I for instructions
			rigger.h.defaultCan(12);
			rigger.ctx.textAlign = "right";
			rigger.ctx.fillText("Press I for How to Play", rigger.width - 20, 10);

			/* Main menuInstructions */
			rigger.h.defaultCan(18);
			rigger.ctx.textAlign = "right";
			rigger.ctx.textBaseline = "bottom";
			rigger.ctx.fillText("\u21E6 \u21E8 Select character    ", rigger.width/2, rigger.height/6);
			rigger.ctx.textAlign = "left";
			rigger.ctx.fillText("Space  Start game!", rigger.width/2, rigger.height/6);
			rigger.ctx.lineWidth = 3;
			rigger.ctx.strokeRect(rigger.width/2 - 20, rigger.height/6 + 5, 125, -30);


			/* Character selection */
			// Set sizes
			rigger.h.defaultCan(18);
			rigger.ctx.textAlign = "center";

			// Details
			var top = rigger.height/5, // Top of the images
			num = Object.keys(rigger.def.players).length, // Number of players
			hei = rigger.height - top - rigger.height/10; // Height of the image

			if(num > 4){
				hei /= 2.1;
				num = Math.min(num, 6);
			}


			// Loop around all the players
			var count = 0;
			for(var n in rigger.def.players){
				if(rigger.def.players.hasOwnProperty(n)){
					showCharacter(rigger.def.players[n], top, num, hei, count);
					count++;
				}
			}
		}

	},



	newGame : function(player){
		var p = player || rigger.def.players.danbarr; // danbarr is the default player
		rigger.game.player = new rigger.Player(p);

		// Generate a random target bar
		rigger.game.target = rigger.h.genBar(true);
		// Create the new, empty bar
		rigger.game.bar = new rigger.Bar();

		// Create a new ladder
		rigger.game.ladder = new rigger.Ladder();


		rigger.locked = false; // Unlock if locked
		rigger.game.menu = 0;

		rigger.game.time = 0; // Reset timer
		rigger.game.instructions = true;
		// Set inGame
		rigger.state = 2;
		rigger.emmitEvent("newgame");
	},

	pause : function(){
		if(rigger.state !== 2){return;} // Only pause in game
		rigger.game.menu = 2;
		rigger.locked = true;
		rigger.emmitEvent("pause");
	},
	unpause : function(){
		if(rigger.game.menu !== 2){return;} // Cannot unpause unless paused
		rigger.game.menu = 0;
		rigger.locked = false;
		rigger.emmitEvent("unpause");
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

	// Default fonts, etc for drawing
	rigger.ctx.font = "12px 'Press Start 2P' Helvetica";
	rigger.ctx.textBaseline = "top";
	rigger.ctx.save();



	try{
		startGameloop();
	}catch(e){
		div.innerHTML = "Error has occurred: Game not supported in this browser/version";
		throw e;
	}


	// Load the assets
	rigger.assets.load(function(load, t){
		if(load === true){ // Check for success (strictly)
			rigger.state = 1; // Show the main menu, let's play!
			rigger.emmitEvent("loaded");
		}else{
			rigger.state = -1;
			rigger.emmitEvent("error");
			throw new Error("Asset \""+t+"\" couldn't load :(");
		}

	});

	// Add the pause and resume listeners, using the PageVisibility API
	var evname = (function(){
		var prefixes = ["webkit","moz","ms","o"];
		if ("hidden" in document) return "visibilitychange";

		for (var i = 0; i < prefixes.length; i++){
			if ((prefixes[i] + "Hidden") in document){
				return prefixes[i] + "visibilitychange";
			}
		}
		return null;
	})();
	if(evname){
		document.addEventListener(evname,function(){
			if(pageHidden()){
				rigger.pause();
			}else{
				rigger.unpause();
			}
		});
	}else{
		// Fallback with blur and focus
		window.addEventListener("blur", function(){rigger.pause();});
		window.addEventListener("focus", function(){setTimeout(rigger.unpause, 50);});
	}
};

rigger.resize = function(w, h){
	rigger.width = (!w || w < 0)?rigger.width:w;
	rigger.height = (!h || h < 0)?rigger.height:h;

	rigger.LS.width = rigger.width/1.396; rigger.LS.height = rigger.height/1.222; // Ratio's for the lighting store
};


// Export rigger object for the rest of the JS
window["rigger"] = rigger;
window["rigger"]["init"] = rigger.init; // Needed for compliltion
})(); // @end
