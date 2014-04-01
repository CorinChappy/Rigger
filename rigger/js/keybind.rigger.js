// Contains keybindings and functions for the game
(function(){
	
	rigger.keysDown = {}; // Contins the currently pressed keys

	/* Event listeners for the keypresses */
	window.addEventListener("keydown", function (e) {
		//e.preventDefault();
		rigger.keysDown[e.keyCode] = true;

		if(rigger.keyPressAction[e.keyCode]){
			rigger.keyPressAction[e.keyCode].call(rigger);
		}
	});
	window.addEventListener("keyup", function (e) {
		//e.preventDefault();
		delete rigger.keysDown[e.keyCode];
	});

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
				rigger.game.player.update(dt, 37); // -dt as we are moving backwards! DUH
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
				if(rigger.game.room ===0){ // In the ANNEX
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
		},
		38 : function(){
			// UP
			if(rigger.state === 1){ // MAIN MENU
				rigger.menuOption = Math.max(0, rigger.menuOption-1);
			}
		},
		39 : function(){
			// RIGHT
		},
		40 : function(){
			// DOWN
			if(rigger.state === 1){ // MAIN MENU
				rigger.menuOption = Math.min(rigger.menuOption+1, 2);
			}
		},

		32 : function(){
			// SPACE
			if(rigger.state === 1){ // MAIN MENU
				if(rigger.menuOption === 0){
					rigger.newGame();
				}
			}
		}
	};
})();
