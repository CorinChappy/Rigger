// Contains the assest locations (images, JSON, etc) + a load function
(function(){
"use strict"; // @start


	rigger.assets = {
		sprites : {
			bg : {
				annex : "sprites/bg/annex.png",
				lampy : "sprites/bg/lampy.png"
			},
			misc : {
				ladder : "sprites/misc/ladder.png",
				design : "sprites/misc/design.png"
			},
			lights : [
				"sprites/lights/fresnel.png",
				"sprites/lights/pc.png",
				"sprites/lights/par.png",
				"sprites/lights/source4.png",
				"sprites/lights/flood.png"
			],
			player : {
				danbarr : {
					left : "sprites/player/danbarr/left.png",
					right : "sprites/player/danbarr/right.png",
					climb : "sprites/player/danbarr/climb.png",
					climb2 : "sprites/player/danbarr/climb2.png",
					front : "sprites/player/danbarr/front.png"
				},
				trojak : {
					left : "sprites/player/trojak/left.png",
					right : "sprites/player/trojak/right.png",
					climb : "sprites/player/trojak/climb.png",
					climb2 : "sprites/player/trojak/climb2.png",
					front : "sprites/player/trojak/front.png"
				},
				corin : {
					left : "sprites/player/corin/left.png",
					right : "sprites/player/corin/right.png",
					climb : "sprites/player/corin/climb.png",
					climb2 : "sprites/player/corin/climb2.png",
					front : "sprites/player/corin/front.png"
				},
				ruth : {
					left : "sprites/player/ruth/left.png",
					right : "sprites/player/ruth/right.png",
					climb : "sprites/player/ruth/climb.png",
					climb2 : "sprites/player/ruth/climb2.png",
					front : "sprites/player/ruth/front.png"
				},
				young_david : {
					left : "sprites/player/young_david/left.png",
					right : "sprites/player/young_david/right.png",
					climb : "sprites/player/young_david/climb.png",
					climb2 : "sprites/player/young_david/climb2.png",
					front : "sprites/player/young_david/front.png"
				},
				aggus : {
					left : "sprites/player/aggus/left.png",
					right : "sprites/player/aggus/right.png",
					climb : "sprites/player/aggus/climb.png",
					climb2 : "sprites/player/aggus/climb2.png",
					front : "sprites/player/aggus/front.png"
				}
			},
			hidden : {
				rory : {
					left : "sprites/player/rory/rory.png",
					right : "sprites/player/rory/rory.png",
					climb : "sprites/player/rory/rory.png",
					climb2 : "sprites/player/rory/rory.png",
					front : "sprites/player/rory/rory.png"
				}
			}
		},

		// Audio stored in an array, index: 0 = ogg; 1 = mp3
		/* Audio keys need to be strings so the closure compiler will not rename them */
		audio : {
			//"bgMusic" : ["audio/ss.mp3", "audio/ss.mp3"],
			"rory" : ["audio/rory.ogg","audio/rory.mp3"]
		},


		load : function(callback){
			var toLoad = 0, loaded = 0, prep = false, er = false,
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
				var s = (!p)?l:l[p];
				if(typeof s === 'string'){ // String means load
					toLoad++;
					var i = new Image();
					i.addEventListener("load", function(){l[p] = i; loaded++; f();});
					i.addEventListener("error", function(){f(s);});
					i.src = rigger.assetDir + s;
				}else{ // Assume string OR object/array
					for(var a in s){
						ims(s, a); // Recurse
					}
				}
			})(rigger.assets.sprites);


			// Load audio using XHR
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
			var dud = {  // Stub methods for audio.js to call
				play : function(){}, stop : function(){}, setVolume : function(){}, loop : 0
			};
			if(ty >= 0 && window.AudioContext){
				// Function that loads each audio file
				var audioLoader = function(m){
					toLoad++;
					var au = rigger.assetDir + rigger.assets.audio[m][ty],
					    xhr = new XMLHttpRequest();
					xhr.open('GET', au, true);
					xhr.responseType = 'arraybuffer';
					xhr.addEventListener("load",function(){
						if(this.status == 200){
							rigger.audio.create(xhr.response, function(aud){
								rigger.assets.audio[m] = aud;
								rigger.assets.audio[m].volume = rigger.settings.volume;
								loaded++;
								f();
							});
						}
					});
					xhr.addEventListener("error",function(){ // Losing sound is not the end of the world, do not throw an error
						rigger.assets.audio[m] = dud;
						loaded++;
						f();
					});
					try{
						xhr.send(); // Attempt to send, if running the game locally (file:///) audio will fail and an error will be thrown here
					}catch(e){}
				}

				for(var m in rigger.assets.audio){
					if(rigger.assets.audio.hasOwnProperty(m)){
						audioLoader(m);
					}
				}
			}else{ // No codec supported
				for(var m in rigger.assets.audio){
					if(rigger.assets.audio.hasOwnProperty(m)){
						rigger.assets.audio[m] = dud;
					}
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
})(); // @end
