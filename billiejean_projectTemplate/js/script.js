let sound;

function preload() {
  sound = loadSound("assets/beat.mp3");
}

//function mousePressed() {
  //sound.play();
//}

function sertup() {
  createCanvas(400, 500);
  background(220);
}

function draw() {
  background(220);

// "true" limits the values within the range!
  let vol = map(mouseY, 0, height, 1.0, 0.0, true);
  sound.setVolume(vol);
  let panning = map(mouseX, 0, width, -1.0, 1.0);
  sound.pan(panning);
}

function mouseDragged() {
  if (sound.isPlaying()) {
    //
    } else {
      sound.play();
    }
  }
