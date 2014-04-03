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
	lights : [
		{
			name : "fresnell",
			img : function(){return rigger.assets.sprites.lights[0]},
			h : 68,
			w : 38
		},
		{
			name : "pc",
			img : function(){return rigger.assets.sprites.lights[1]},
			h : 68,
			w : 38
		},
		{
			name : "parcan",
			img : function(){return rigger.assets.sprites.lights[2]},
			h : 64,
			w : 50
		},
		{
			name : "source 4",
			img : function(){return rigger.assets.sprites.lights[3]},
			h : 76,
			w : 50
		}

	],

	players : {
		danbarr : {

			name : "danbarr",

			imgs : rigger.assets.sprites.player.danbarr, // Image assets for different positions

			/* Speed of player in different situations (in px/s)
			 * 0 = normal; 1 = up ladder; 2 = carry ladder; 3 = carry light
			*/
			speeds : [300, 200, 150, 200],

			h : 100,
			w : 62
		},
		trojak : {
			name : "Trojak",

			imgs : rigger.assets.sprites.player.trojak,

			speeds : [300, 200, 150, 200],

			h : 100,
			w : 62
		}
	},
	hidden : {
		rory : {
			name : "Rory",

			imgs : rigger.assets.sprites.hidden.rory,

			speeds : [300, 200, 150, 250],

			h : 150,
			w : 100
		}
	}
};
})();