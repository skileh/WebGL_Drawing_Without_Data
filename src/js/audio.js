let sound;
let freq;
function preload(){
  sound = loadSound('src/assets/lofi.mp3');
}

function setup(){
  var cnv = createCanvas(100, 50);
  var x = (0) ;
  var y = (0) ;
  cnv.position(x, y);
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  sound.amp(1);
}

function draw(){
  background(1000);

  fill(255, 0, 255);
  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(20);
  var aux=0;
  for (let i = 0; i < waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 0, height);
    freq=waveform[i];
    if(aux<waveform[i]){
      aux=waveform[i];
    }
    vertex(x,y);
  }
  freq=aux;
  endShape();

  text('tap to play', 20, 20);
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}