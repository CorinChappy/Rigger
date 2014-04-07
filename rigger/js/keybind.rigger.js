// Contains keybindings and functions for the game
(function(){
"use strict";
	
	rigger.keysDown = {}; // Contins the currently pressed keys

	rigger.keyFunc = {
		keydown : function(e){
			//e.preventDefault();
			rigger.keysDown[e.keyCode] = true;

			if(rigger.keyPressAction[e.keyCode] && !rigger.locked){
				rigger.keyPressAction[e.keyCode].call(rigger);
			}
		},
		keyup : function(e){
			//e.preventDefault();
			delete rigger.keysDown[e.keyCode];
		}
	}

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
			if(rigger.state === 2){ // IN GAME
				var p = rigger.game.player;
				if(rigger.game.room === 1 && p.g.x <= 0 - p.g.w/2){
					p.g.x = rigger.width - p.g.w; // Move to annex
					rigger.game.room = 0;
				}
				p.update(dt, 37);
			}
		},
		38 : function(dt, a){
			// UP
			if(rigger.state === 2){
				rigger.game.player.update(dt, 38);
			}
		},
		39 : function(dt, a){
			// RIGHT
			if(rigger.state === 2){ // IN GAME
				var p = rigger.game.player;
				// Check screen edge
				if(rigger.game.room === 0 && p.g.x >= rigger.width - p.g.w/2){
					p.g.x = 0; // Move to light store
					rigger.game.room = 1;
				}
				rigger.game.player.update(dt, 39);
			}
		},
		40 : function(dt, a){
			// DOWN
			if(rigger.state === 2){
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
		},
		38 : function(){
			// UP
		},
		39 : function(){
			// RIGHT
			if(rigger.state === 1){ // MAIN MENU
				rigger.menuOption = Math.min(rigger.menuOption+1, 2);
			}
		},
		40 : function(){
			// DOWN
		},

		32 : function(){
			// SPACE
			if(rigger.state === 1){ // MAIN MENU
				rigger.newGame(rigger.def.players[Object.keys(rigger.def.players)[rigger.menuOption]]);
				return;
			}
			if(rigger.state === 2){ // IN game
				rigger.game.player.update(0, 32);
				// Test for winning conditions
				if(rigger.Bar.equals(rigger.game.bar, rigger.game.target)){
					rigger.locked = true;
					var d = document.createElement("h2");
					d.innerHTML = "You win. Time = "+rigger.game.time/1000+" seconds";
					document.body.appendChild(d);
				}
			}
		},
		68 : function(){ // D
			if(rigger.state === 2){ // IN GAME
				rigger.game.menu = (rigger.game.menu === 0)?1:0;
			}
		},
		82 : function(){
			if(rigger.state === 2){ // IN GAME
				var x = rigger.game.player.g.x;
				rigger.game.player = new rigger.Player(rigger.def.hidden.rory);
				rigger.game.player.g.x = x;
				rigger.audio.play("rory");
			}
		}
	};
})();
