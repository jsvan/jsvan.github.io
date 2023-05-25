

class Music {
	
	constructor(number="+1 (981) 867-5309", tonic=262, tempo=200, wavetype = 3){
		this.tonic = tonic;
		this.tempo = tempo;
		this.semitone = 1.0595;
		this.S = 16
		this.E = 8;
		this.Q = 4;
		this.H = 2;
		this.W = 1;
		this.number;
		this.notes;

		this.wavetype;
		this.preZ = null;
		this.allwaves = new Map([[0, 'square'], [1, 'sine'], [2, 'sawtooth'], [3, 'triangle']]);
		
		// maps scale degree to #semitones above root. 0 is high.
		//[ I'm gonna over optimize this lol
		//	[1, this.semitone ** 0], 
		//	[2, this.semitone ** 2], 
		//	[3, this.semitone ** 4], 
		//	[4, this.semitone ** 5], 
		//	[5, this.semitone ** 7], 
		//	[6, this.semitone ** 9], 
		//	[7, this.semitone ** 11], 
		//	[8, this.semitone ** 12], 
		//	[9, this.semitone ** 14], 
		//	[0, this.semitone ** 12]]);
		
		
		this.notemap = new Map();
		this.notemap.set(1, this.semitone       ** 0); 					//0 half tones
		this.notemap.set(2, this.semitone       ** 2); 					//2 half tones
		this.notemap.set(3, this.notemap.get(2) * this.notemap.get(2)); //4 half tones
		this.notemap.set(4, this.semitone 	    * this.notemap.get(3) ); //5 half tones
		this.notemap.set(5, this.notemap.get(2) * this.notemap.get(4) ); //7 half tones
		this.notemap.set(6, this.notemap.get(2) * this.notemap.get(5)); //9 half tones
		this.notemap.set(7, this.notemap.get(2) * this.notemap.get(6)); // 11 half tones
		this.notemap.set(8, this.semitone	    * this.notemap.get(7)); // 12 half tones
		this.notemap.set(9, this.notemap.get(5) * this.notemap.get(5)); // 14 half tones
		this.notemap.set(0, this.notemap.get(8)); 						// 12 half tones
		
		
		
		
		// create web audio api context
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.setNumber(number);
		this.setWavetype(wavetype);
	}
	
	setNumber(number){
		this.number = number.replace(/\D/g,'');
		this.notes = this.processNumber();
	}
	setTonic(tonic) {
		this.tonic = Number(tonic.replace(/\D/g,''));
	}
	setTempo(tempo) {
		this.tempo = Number(tempo.replace(/\D/g,''));	
	}

	
	setWavetype(wavetype){
		if (wavetype < 0 || wavetype >= 4) {
				wavetype = 0;
		}
		
		this.wavetype = this.allwaves.get(wavetype);
	
	}
	

	processNumber(){
	  let res = [];
	  let n;
	  let modL = (this.number.length + 1) % 3
	  let r;
	  for (let i = 0; i < this.number.length; i++){
		r = this.Q;
		n = Number(this.number[i]);
		if (n == 0) {
			n = this.handleZero(i, this.number);
			this.preZ = n;
			r = this.E;
			res.push([this.tonic * this.notemap.get(n), r]); // 2x eighth note
		}
		r = (i == this.number.length - 1) ? this.H : r ;
		res.push([this.tonic * this.notemap.get(n), r]);
	  	if ( i % 3 == modL && i+3 < this.number.length){
	  		res.push([0, this.Q]); // rest
	  		this.preZ = null;
	  	}
	  }
	  return res;
	}
	
	// advanced AI
	handleZero(i, num) {
		//if 0s
		//	and following an 8
		//		then make 1
		//	and following a 1
		//		then make 8
		//	and preceding an 8
		//		then make 1
		//	and preceding a 1	
		//		then make 8
		//	and following a number < 5
		//		then make 1
		//	and following a number > 5
		//		then make 8
		let pre;
		let post;
		if (i > 0) {
			pre = Number(num[i - 1]);
			if (pre == 0) return this.preZ;
			if (pre == 8) return 1;
			if (pre == 1) return 8;
		}
		if (i < num.length - 1) {
			post = Number(num[i + 1]);
			if (post == 8) return 1;
			if (post == 1) return 8;
		}
		if (this.preZ!==null) return this.preZ;
		if (pre){
			if (pre < 6) return 1;
			if (pre > 5) return 8;
		}
		if (post) {
			if (post < 6) return 1;
			if (post > 5) return 8;
		}
		return 0;
	}

	play(i=0){
		if (i < this.notes.length) {
		  this.playNote(i, ()=>{this.play(i+1)});
		}
	}

	playNote(i, callback) {
		// create Oscillator node
		let oscillator = this.audioCtx.createOscillator();
		oscillator.type = this.wavetype;
		oscillator.frequency.value = this.notes[i][0]; // value in hertz
		oscillator.connect(this.audioCtx.destination);
		oscillator.onended = callback;
		oscillator.start(0);
		oscillator.stop(this.audioCtx.currentTime + (256 / (this.notes[i][1] * this.tempo)) );
	}
}		
