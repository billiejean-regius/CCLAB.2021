/////global
let targetAngle = 0.0;
let currentAngle = 0.0;
let x = 0.0;
let y = 0.0;
let smoothSpeed =0.02;
let scl = 25.0;
const count = 3;
let iToTheta;

let fly;

let flyLocation;

let gif;

function preload(){
  gif = createImg("js/assets/gif/butterfly2-1.gif");
}

function setup() {
  createCanvas(600, 400);

  //bubble1 = new Bubble(100, 200, 25);

  flyLocation = createVector(x, y);
  // Vector tracks loc of fly
}

function  setup() {

  let canvas = createCanvas(800, 300);
  canvas.id("p5-canvas");

	//bubble1 = new Bubble(100, 200, 25);

  flyLocation = createVector(x, y);
  // Vector tracks loc of fly

}

function draw() {
  background(220);

 targetAngle = atan2(mouseY - y, mouseX - x);
 currentAngle = lerpAngle(currentAngle, targetAngle, smoothSpeed);

 var target = createVector(mouseX, mouseY);
 var distance = target.dist(flyLocation);
 var mappedDistance = map(distance, 0, 5, 1, 1);

 target.sub(flyLocation);
 target.normalize(); // Normalize the vector to length 1 (make it a unit vector).
 target.mult(mappedDistance);

 flyLocation.add(target);

 fly = new Butterfly(flyLocation.x,  flyLocation.y, 10);

  // INTERSECTION COMMUNICATION

  //bubble1.show();
  fly.show();
  //bubble1.move();
  //bubble2.move();
  fly.x = mouseX;
  fly.y = mouseY;
}

// CLASS BUTTERFLY

class Butterfly {
  constructor(x, y, r = 50) { //constructor(name, height, width)
    this.x = x; //this.name = name;
    this.y = y; //this.height = height;
    this.r = r; //this.width = width;
    this.brightness = 0;
  }

  show() {

    x= width * 0.5;
    y = height * 0.5;
    iToTheta = TWO_PI / count;


    gif.position(this.x, this.y);
    gif.size(100, 100);


    push();
    noFill();
    beginShape();
    for (let i = 0; i < count; i+=0.01) {
		const theta = currentAngle + i * iToTheta;
    vertex(this.x + cos(theta) * scl, this.y + sin(theta) * scl);

    }
    endShape(CLOSE);
    pop();


    // DIRECTIONAL LINES

    push();
    strokeWeight(2);
		stroke(color(169, 204, 227));
		line(this.x, this.y, this.x + cos(targetAngle) * scl,
		this.y + sin(targetAngle) * scl);
    pop();

    push();
    strokeWeight(2);
		stroke(color( 230, 126, 34 ));
		line(this.x, this.y, this.x + cos(currentAngle) * scl,
		this.y + sin(currentAngle) * scl);
    pop();
  }
}

// Linear interpolation of an angle.
function lerpAngle(a, b, step) {
	// Prefer shortest distance,
	const delta = b - a;
	if (delta == 0.0) {
		return a;
	} else if (delta < -PI) {
		b += TWO_PI;
	} else if (delta > PI) {
		a += TWO_PI;
	}
	return (1 - step) * a + step * b;
}

//flip event

function flip(event){
	var element = event.currentTarget;
	if (element.className === "card") {
    if(element.style.transform == "rotateY(180deg)") {
      element.style.transform = "rotateY(0deg)";
    }
    else {
      element.style.transform = "rotateY(180deg)";
    }
  }
};
