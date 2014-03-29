// Contains the assest locations (images, JSON, etc) + a load function
(function(){
	rigger.assets = {
		sprites : {
			lights : [],
			rooms : [],
			player : {
				"danbarr" : "assets/sprites/danbarr"
			}
		},



		load : function(){
			// Create new Image objects for each asset and wait till the have all loaded
			var toLoad = 0; var loaded = 0; var prep = false;
			for(var sprites in rigger.assets.sprites){
				for(var sprite in sprites){
					toLoad++;
					var i = new Image(sprite);
					i.onLoad = function(){loaded++;}
				}
			}
			prep = true;
			rigger.assets.isLoaded = function(){return (prep && (toLoad === loaded));};
		}
	};
})();