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

		audio : {
			//bgMusic : "assets/audio/bg"
		},


		load : function(){
			var toLoad = 0; var loaded = 0; var prep = false;

			// Create new Image objects for each asset and wait till the have all loaded
			for(var a in rigger.assets.sprites){
				for(var b in rigger.assets.sprites[a]){
					var sprite = rigger.assets.sprites[a][b];
					toLoad++;
					var i = new Image();
					i.onload = function(){rigger.assets.sprites[a][b] = i; loaded++;};
					i.onerror = function(){throw new Error("Could not load something :(");};
					i.src = sprite;
				}
			}

			// Load audio in a sim. way
			for(var m in rigger.assets.audio){
				toLoad++;
				var i = new Audio();
				i.addEventListener('loadeddata',function(){rigger.assets.audio[m] = i; loaded++;});
				i.addEventListener('onerror',function(){throw new Error("Could not load something :(");});
				i.src = rigger.assets.audio[m];
			}



			prep = true;
			rigger.assets.isLoaded = function(){return (prep && (toLoad === loaded));};
		}
	};
})();
