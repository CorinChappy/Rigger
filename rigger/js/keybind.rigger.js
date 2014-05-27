// Contains keybindings and functions for the game
(function(){ 
"use strict"; // @start
	
	rigger.keysDown = {}; // Contins the currently pressed keys

	rigger.keyFunc = {
		keydown : function(e){
			//e.preventDefault();
			rigger.keysDown[e.keyCode] = true;

			if(rigger.keyPressAction[e.keyCode] && !rigger.locked){
				e.preventDefault();
				rigger.keyPressAction[e.keyCode].call(rigger);
			}
		},
		keyup : function(e){
			//e.preventDefault();
			delete rigger.keysDown[e.keyCode];
		}
	};

	/* Event listeners for the keypresses */
	window.addEventListener("keydown", rigger.keyFunc.keydown);
	window.addEventListener("keyup", rigger.keyFunc.keyup);

	/* Mapping from char to keycode for each key */
	window.what = {
		"left":37, "up":38, "right":39, "down":40,
		"space":32
	};


	/* The actions taken when each key is HELD
	 * a can be something passed in, not decided what yet...
	 */
	rigger.keyAction = {
		37 : function(dt, a){
			// LEFT
			if(rigger.state === 2 && rigger.game.menu === 0){ // IN GAME
				var p = rigger.game.player;
				if(rigger.game.room === 0 && p.g.x <= 0 - p.g.w/2){
					p.g.x = rigger.width - p.g.w; // Move to light store
					rigger.game.room = 1;
				}
				p.update(dt, 37);
			}
		},
		38 : function(dt, a){
			// UP
			if(rigger.state === 2 && rigger.game.menu === 0){
				rigger.game.player.update(dt, 38);
			}
		},
		39 : function(dt, a){
			// RIGHT
			if(rigger.state === 2 && rigger.game.menu === 0){ // IN GAME
				var p = rigger.game.player;
				// Check screen edge
				if(rigger.game.room === 1 && p.g.x >= rigger.LS.width - p.g.w/2){
					p.g.x = 0; // Move to annex
					if(rigger.game.instructions){
						rigger.game.instructions = false; // Hide instructions after first veiwing
					}
					rigger.game.room = 0;
				}
				rigger.game.player.update(dt, 39);
			}
		},
		40 : function(dt, a){
			// DOWN
			if(rigger.state === 2 && rigger.game.menu === 0){
				rigger.game.player.update(dt, 40);
			}
		},

		32 : function(dt, a){
			// SPACE
			if(rigger.state === 2){
				if(rigger.game.room === 0){ // In the ANNEX
					this.game.ladder.update();
				}
			}
		}
	};


	/* 
	 * The actions taken when each key is PRESSED
	 */
	rigger.keyPressAction = {
		37 : function(){
			// LEFT
			if(rigger.state === 1){ // MAIN MENU
				rigger.menuOption = Math.max(0, rigger.menuOption-1);
			}
			if(rigger.game.menu === 3){ // Gel selection
				rigger.menuOption = Math.max(0, rigger.menuOption-1);
			}
		},
		38 : function(){
			// UP
			if(rigger.game.menu === 3){ // Gel selection
				rigger.menuOption = Math.max(0, rigger.menuOption-5);
			}
		},
		39 : function(){
			// RIGHT
			if(rigger.state === 1){ // MAIN MENU
				rigger.menuOption = Math.min(rigger.menuOption+1, Object.keys(rigger.def.players).length-1);
			}
			if(rigger.game.menu === 3){ // Gel selection
				rigger.menuOption = Math.min(rigger.menuOption+1, Object.keys(rigger.gelRef).length);
			}
		},
		40 : function(){
			// DOWN
			if(rigger.game.menu === 3){ // Gel selection
				rigger.menuOption = Math.min(rigger.menuOption+5, Object.keys(rigger.gelRef).length);
			}
		},

		32 : function(){ // SPACE
			if(rigger.state === 1){ // MAIN MENU
				rigger.newGame(rigger.def.players[Object.keys(rigger.def.players)[rigger.menuOption]]);
				return;
			}
			if(rigger.state === 2){ // IN game
				if(rigger.game.menu === 3){ // Gel selection
					if(rigger.game.player.light){
						if(rigger.menuOption === 0){
							rigger.game.player.light.addGel(null);
						}else{
							rigger.game.player.light.addGel(Object.keys(rigger.gelRef).sort()[rigger.menuOption - 1]);
						}
						rigger.game.menu = 0;
					}
					return;
				}
				rigger.game.player.update(0, 32);
				// Test for winning conditions
				if(rigger.Bar.equals(rigger.game.bar, rigger.game.target)){
					rigger.state = 3; // Set state to victory
					rigger.emmitEvent("victory", {time: rigger.game.time, character: rigger.game.player.who()});
					return;
				}
			}
			if(rigger.state === 3 || rigger.state === 4){ // VICTORY or FAILURE
				rigger.state = 1;
			}
		},

		68 : function(){ // D
			if(rigger.state === 2){ // IN GAME
				rigger.game.menu = (rigger.game.menu === 0)?1:0;
			}
		},

		73 : function(){ // I
			// Show/hide the instructions
			rigger.game.instructions = !rigger.game.instructions;
		},

		82 : function(){
			if(rigger.state === 2){ // IN GAME
				var x = rigger.game.player.g.x,
				l = rigger.game.player.light, p = new rigger.Player(rigger.def.hidden.rory);
				p.g.x = x;
				p.light = l;
				rigger.game.player = p;
				p.update(0);
				rigger.audio.play("rory");
			}
		}

	};
	rigger.keyPressAction[13] = rigger.keyPressAction[32]; // Make ENTER an alias for SPACE

})(); // @end
