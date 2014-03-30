// Contains the assest locations (images, JSON, etc) + a load function
(function(){
	rigger.assets = {
		sprites : {
			lights : [],
			rooms : [],
			player : {
				//"danbarr" : "assets/sprites/danbarr"
			}
		},

		// Audio stored in an array, index: 0 = ogg; 1 = mp3
		audio : {
			//bgMusic : ["assets/audio/ss.mp3", "assets/audio/ss.mp3"]
		},


		load : function(callback){
			var toLoad = 0; var loaded = 0; var prep = false; var er= false;
			var f = function(a){ // Function called when an asset is loaded
				if(er){return;} // Error has already happened, no point here
				if(a){
					callback.call(rigger, false); // Failure
					er = true;
					return;
				}

				if(rigger.assets.isLoaded()){
					callback.call(rigger, true); // Fully Loaded
					return;
				};

				callback.call(rigger, Math.floor((loaded/toLoad)*100)); // Return the percentage
			};

			// Create new Image objects for each asset and wait till the have all loaded
			for(var a in rigger.assets.sprites){
				for(var b in rigger.assets.sprites[a]){
					var sprite = rigger.assets.sprites[a][b];
					toLoad++;
					var i = new Image();
					i.addEventListener("load", function(){rigger.assets.sprites[a][b] = i; loaded++; f();});
					i.addEventListener("error", function(){f(true);});
					i.src = sprite;
				}
			}

			// Load audio in a sim. way
			var ty = (function(){ // Use the right codec
				var a = new Audio();
				if(a.canPlayType("audio/ogg; codecs=vorbis") != ""){
					return 0;
				}else{
					if(a.canPlayType("audio/mpeg") != ""){
						return 1;
					}
				}
				return 0;
			})();
			for(var m in rigger.assets.audio){
				toLoad++;
				var au = rigger.assets.audio[m][ty];
				var i = new Audio();
				i.addEventListener("loadeddata",function(){rigger.assets.audio[m] = i; loaded++; f();});
				i.addEventListener("error",function(){f(true);});
				i.src = au;
				i.volume = rigger.settings.volume;
			}



			prep = true;
			rigger.assets.isLoaded = function(){return (prep && (toLoad === loaded));};

			// Call f here just in case there are no assets
			f();
		},

		isLoaded : function(){return false;}
	};
})();
