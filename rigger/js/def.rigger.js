/* File containing the definitions for each thing in the game */
(function(){
"use strict";

/* Functions to get a width from a height or visa versa 
 * Gets the ratio of a and b and applies it to c
 * IE: The original proportions are a & b, c is the width, the height will be returned
 * a and c must be the same thing (width or height)
*/
function keepProportions(a, b, c){
	return (b/a)*c;
};


rigger.def = {

	players : {
		danbarr : {

			name : "danbarr",

			imgs : rigger.assets.sprites.player.danbarr, // Image assets for different positions

			h : 100,
			w : 62
		}
	}
};
})();