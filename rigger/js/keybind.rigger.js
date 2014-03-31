// Contains keybindings and functions for the game
(function(){
	
	rigger.keysDown = {}; // Contins the currently pressed keys

	/* Event listeners for the keypresses */
	window.addEventListener("keydown", function (e) {
		rigger.keysDown[e.keyCode] = true;
	});
	window.addEventListener("keyup", function (e) {
		delete rigger.keysDown[e.keyCode];
	});

	/* Mapping from char to keycode for each key */
	window.what = {
		"left":37, "up":38, "right":39, "down":40,
		"space":32
	};


	/* The actions taken when each key is pressed
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
		}
	};

})()