let capture; // this is the video camera
let cam;

function setup() {
	createCanvas(640, 480);
	pixelDensity(1);
	background(100);

	capture = createCapture(VIDEO);
	capture.size(640, 480);
	capture.hide();
}

function draw() {
	cam = capture.get(); // copying frames

	if(cam.width > 0) {
		cam.loadPixels(); // getting pixel array

		for(var i = 0; i < cam.pixels.length; i += 4) // combination of double for loop mentioned in other tutorials
		{
			var r = cam.pixels[i+0];
			var g = cam.pixels[i+1];
			var b = cam.pixels[i+2];
      //cam
			cam.pixels[i+0] = mouseX;
			cam.pixels[i+1] = g;
			cam.pixels[i+2] = mouseY;
      //
      
		}
		cam.updatePixels();
		image(cam, 0, 0, width, height);
	}
}
