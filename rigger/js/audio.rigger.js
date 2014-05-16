// Audio control for music and sound effects in the game
(function(){
"use strict";
	
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

		stop : function(track){
			var p =  rigger.assets.audio[track];
			if(p && p.play){
				p.loop = false;
				p.stop();
			}
		},

		setVol : function(vol){
			rigger.settings.volume = vol;
			for(var a in rigger.assets.audio){
				if(rigger.assets.audio.hasOwnProperty(a)){
					rigger.assets.audio[a].volume = vol;
				}
			}
		},

		volUp : function(){
			rigger.audio.setVol(0.1);
		},

		volDown : function(){
			rigger.audio.setVol(-0.1);
		}
		
		
	};
})();
