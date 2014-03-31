/* File containing the definitions for each thing in the game */
(function(){
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

			imgs : { // Image assets for different positions
				right : rigger.assets.sprites.player[who],
				left : rigger.assets.sprites.player[who],
				back : rigger.assets.sprites.player[who]
			},

			h : 50,
			w : keepProportions(this.right.height, this.right.width, this.h)
		}
	}


};
})();