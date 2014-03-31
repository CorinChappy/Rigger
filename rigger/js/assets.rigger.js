// Contains the assest locations (images, JSON, etc) + a load function
(function(){
	rigger.assets = {
		sprites : {
			lights : [],
			rooms : [],
			player : {
				danbarr : {
					left : "assets/sprites/player/danbarr/left.png",
					right : "assets/sprites/player/danbarr/right.png"
				}
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

				rigger.assets.loaded = (loaded/toLoad)*100; // Set the loaded var
				if(rigger.assets.isLoaded()){
					callback.call(rigger, true); // Fully Loaded
					return;
				}
			};

			// Create new Image objects for each asset and wait till the have all loaded
			(function ims(l, p){
				if(typeof l[p] === 'string'){ // String means load
					toLoad++;
					var i = new Image();
					i.addEventListener("load", function(){l[p] = i; loaded++; f();});
					i.addEventListener("error", function(){f(true);});
					i.src = l[p];
				}else{ // Assume string OR object/array
					for(var a in l[p]){
						ims(l[p], a); // Recurse
					}
				}
			})(rigger.assets, "sprites");


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

		isLoaded : function(){return false;},

		loaded : 0 // percentage loaded
	};
})();
