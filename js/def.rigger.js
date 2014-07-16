/* File containing the definitions for each thing in the game */
(function(){
"use strict"; // @start

/* Functions to get a width from a height or visa versa 
 * Gets the ratio of a and b and applies it to c
 * IE: The original proportions are a & b, c is the width, the height will be returned
 * a and c must be the same thing (width or height)
*/
function keepProportions(a, b, c){
	return (b/a)*c;
}


rigger.def = {
	lights : [
		{
			name : "fresnel",
			t : 0,
			img : function(){return rigger.assets.sprites.lights[0];},
			h : 58,
			w : 38,
			gelPos : {
				x : 2,
				y : 13,
				h : 5,
				w: 34
			}
		},
		{
			name : "pc",
			t : 1,
			img : function(){return rigger.assets.sprites.lights[1];},
			h : 58,
			w : 38,
			gelPos : {
				x : 2,
				y : 13,
				h : 5,
				w: 34
			}
		},
		{
			name : "parcan",
			t : 2,
			img : function(){return rigger.assets.sprites.lights[2];},
			h : 58,
			w : 45,
			gelPos : {
				x : 2,
				y : 18,
				h : 5,
				w: 41
			}
		},
		{
			name : "source 4",
			t : 3,
			img : function(){return rigger.assets.sprites.lights[3];},
			h : 76,
			w : 35,
			gelPos : {
				x : 5,
				y : 15,
				h : 5,
				w: 25
			}
		},
		{
			name : "flood",
			t : 4,
			img : function(){return rigger.assets.sprites.lights[4];},
			h : 41,
			w : 50,
			gelPos : {
				x : 2,
				y : 15,
				h : 5,
				w: 46
			}
		}

	],

	players : {
		danbarr : {

			name : "danbarr",

			imgs : rigger.assets.sprites.player.danbarr, // Image assets for different positions

			/* Speed of player in different situations (in px/s)
			 * 0 = normal; 1 = up ladder; 2 = carry ladder; 3 = carry light
			*/
			speeds : [350, 250, 200, 250],

			h : 100,
			w : 62
		},
		trojak : {
			name : "Trojak",

			imgs : rigger.assets.sprites.player.trojak,

			speeds : [350, 250, 200, 250],

			h : 100,
			w : 62
		},
		corin : {
			name : "Corin",

			imgs : rigger.assets.sprites.player.corin,

			speeds : [350, 250, 200, 250],

			h : 100,
			w : 62
		},
		ruth : {
			name : "Ruth",

			imgs : rigger.assets.sprites.player.ruth,

			speeds : [350, 250, 200, 250],

			h : 100,
			w : 62
		},
		young_david : {
			name : "Young David",

			imgs : rigger.assets.sprites.player.young_david,

			speeds : [350, 250, 200, 250],

			h : 100,
			w : 62
		},
		aggus : {
			name : "Aggus",

			imgs : rigger.assets.sprites.player.aggus,

			speeds : [350, 250, 200, 250],

			h : 100,
			w : 62
		}
	},
	hidden : {
		rory : {
			name : "Rory",

			imgs : rigger.assets.sprites.hidden.rory,

			speeds : [200, 200, 150, 200],

			h : 150,
			w : 100
		}
	}
};
})();
