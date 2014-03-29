(function(){

var deps;

/* Mapping from the integer representations to the string representations (name)
 * Running rigger.objs.lights[num] will return the name of the light that num represents
*/
var objs = {
	rooms : ["annex", "light store", "gel draw"],
	lights : ["fresnel", "pc", "parcan", "flood", "source 4"]
};

var rigger = {

	width : 512, height : 480,

	canvas : null, // The canvas object
	ctx : null, // The canvas context

	inGame : false,

	objs : objs,

	player : null, // The current character

	/* Current room
	 * 0 = Annex; 1 = Light Store; 2 = Gel Draw
	*/
	room : 0,

	/* Currently displayed menu overlay
	 * 0 = none;
	*/
	menu : 0,

	bar : null, // The bar's current state

	target : null, // The target bar

	/* Global settings for the game */
	settings : {
		barSize : 20, // Size of the bars
		volume : 100 // Volume for sound effects

	},
	// Generate a random bar
	genBar : function(){

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
		}
	},

	e : {
		// Update the bits with respect to time
		update : function(dt){
			// Call the even if a key is held down
			for(var i in rigger.keysDown){
				if(rigger.keyAction[i]){
					rigger.keyAction[i].call(rigger, dt);
				}
			}

			// Update the bar
			rigger.bar.update();
		},

		// THE drawing function
		draw : function(){
			rigger.ctx.clearRect(0,0, rigger.width, rigger.height);
			rigger.d.room();
			if(rigger.inGame){
				rigger.player.draw();
				rigger.bar.draw();
			}
		}
	},

	// Misc drawing functions
	d : {
		room : function(){
			// Draw the room green for now
			rigger.ctx.fillStyle = "green";
			rigger.ctx.fillRect(0,0, rigger.width, rigger.height);
			rigger.ctx.fillStyle = "black";
			rigger.ctx.font = "24px Helvetica";
			rigger.ctx.textBaseline = "top";
			rigger.ctx.fillText("Welcome to Rigger!", 20, 10);
		},
		menu : function(){

		}
	}
};




rigger.newGame = function(player){
	var p = player || "danbarr"; // danbarr is the default player
	rigger.player = new rigger.Player(p);

	// Generate a random target bar
	rigger.target = rigger.genBar();
	// Create the new, empty bar
	rigger.bar = new rigger.Bar();

	// Remove the main menu
	rigger.menu = 0;
	// Set inGame
	rigger.inGame = true;
};


rigger.init = function(){
	// Create the canvas object
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = rigger.width;
	canvas.height = rigger.height;
	document.getElementById("game").appendChild(canvas);
	rigger.canvas = canvas;
	rigger.ctx = ctx;

	// Do some setup stuff
	rigger.assets.load();
	rigger.newGame();
	// Create gameloop etc.
	gameloop(function(dt){
		// Do shizz
		rigger.e.update(dt);
		rigger.e.draw();
	});
};


// Export rigger object for the rest of the JS
window.rigger = rigger;
})();


// INIT on load, rigger gets replaced to become an obj after it is called
window.addEventListener("load",function(){
	rigger.init();
});