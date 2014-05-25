// Contains the assest locations (images, JSON, etc) + a load function
(function(){
"use strict";

	rigger.assets = {
		sprites : {
			bg : {
				annex : "assets/sprites/bg/annex.png",
				lampy : "assets/sprites/bg/lampy.png"
			},
			misc : {
				ladder : "assets/sprites/misc/ladder.png"
			},
			lights : [
				"assets/sprites/lights/fresnel.png",
				"assets/sprites/lights/pc.png",
				"assets/sprites/lights/par.png",
				"assets/sprites/lights/source4.png",
				"assets/sprites/lights/flood.png"
			],
			player : {
				danbarr : {
					left : "assets/sprites/player/danbarr/left.png",
					right : "assets/sprites/player/danbarr/right.png",
					climb : "assets/sprites/player/danbarr/climb.png",
					climb2 : "assets/sprites/player/danbarr/climb2.png",
					front : "assets/sprites/player/danbarr/front.png"
				},
				trojak : {
					left : "assets/sprites/player/trojak/left.png",
					right : "assets/sprites/player/trojak/right.png",
					climb : "assets/sprites/player/trojak/climb.png",
					climb2 : "assets/sprites/player/trojak/climb2.png",
					front : "assets/sprites/player/trojak/front.png"
				},
				corin : {
					left : "assets/sprites/player/corin/left.png",
					right : "assets/sprites/player/corin/right.png",
					climb : "assets/sprites/player/corin/climb.png",
					climb2 : "assets/sprites/player/corin/climb2.png",
					front : "assets/sprites/player/corin/front.png"
				}
			},
			hidden : {
				rory : {
					left : "assets/sprites/player/rory/rory.png",
					right : "assets/sprites/player/rory/rory.png",
					climb : "assets/sprites/player/rory/rory.png",
					climb2 : "assets/sprites/player/rory/rory.png",
					front : "assets/sprites/player/rory/rory.png"
				}
			}
		},

		// Audio stored in an array, index: 0 = ogg; 1 = mp3
		audio : {
			//bgMusic : ["assets/audio/ss.mp3", "assets/audio/ss.mp3"]
			rory : ["assets/audio/rory.ogg","assets/audio/rory.mp3"]
		},


		load : function(callback){
			var toLoad = 0, loaded = 0, prep = false, er= false,
			f = function(a){ // Function called when an asset is loaded
				if(er){return;} // Error has already happened, no point here
				if(a){
					callback.call(rigger, false, a); // Failure
					er = true;
					return;
				}

				rigger.assets.loaded = (loaded/toLoad)*100; // Set the loaded var
				if(rigger.assets.isLoaded()){
					callback.call(rigger, true); // Fully Loaded
					return;
				}
			};

			// Create new Image objects for each asset and wait till the have all loaded
			(function ims(l, p){
				var s = l[p];
				if(typeof s === 'string'){ // String means load
					toLoad++;
					var i = new Image();
					i.addEventListener("load", function(){l[p] = i; loaded++; f();});
					i.addEventListener("error", function(){f(s);});
					i.src = s;
				}else{ // Assume string OR object/array
					for(var a in s){
						ims(s, a); // Recurse
					}
				}
			})(rigger.assets, "sprites");


			// Load audio in a sim. way
			var ty = (function(){ // Use the right codec
				try {
					var a = new Audio();
					if(a.canPlayType("audio/ogg; codecs=vorbis") != ""){
						return 0;
					}else{
						if(a.canPlayType("audio/mpeg") != ""){
							return 1;
						}
					}
				}catch(e){}
				return -1;
			})();
			if(ty >= 0){
				for(var m in rigger.assets.audio){
					(function(m){
						toLoad++;
						var au = rigger.assets.audio[m][ty],
						    i = new Audio();
						i.addEventListener("loadstart",function(){rigger.assets.audio[m] = i; loaded++; f();});
						i.addEventListener("error",function(){f(au);});
						i.src = au;
						i.volume = rigger.settings.volume;
					})(m);
				}
			}else{ // No codec supported
				for(var m in rigger.assets.audio){
					rigger.assets.audio[m] = {
						pause : function(){}, play : function(){} // Stub methods for audio.js to call
					};
				}
			}



			prep = true;
			rigger.assets.isLoaded = function(){return (prep && (toLoad === loaded));};

			// Call f here just in case there are no assets
			f();
		},

		isLoaded : function(){return false;},

		loaded : 0 // percentage loaded
	};
})();
