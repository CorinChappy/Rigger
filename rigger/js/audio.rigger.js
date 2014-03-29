// Audio control for music and sound effects in the game
(function(){
	
	rigger.audio = {
		
		play : function(track){
			var p =  rigger.assets.audio[track];
			if(p && p.play){
				p.play();
			}
		},

		playLoop : function(track){
			rigger.assets.audio[track].loop = true;
			rigger.audio.play(track);
		},

		setVol : function(vol){
			for(var a in rigger.assets.audio){
				rigger.assets.audio[a].volume = vol;
			}
		}
		
		
	};
})();
