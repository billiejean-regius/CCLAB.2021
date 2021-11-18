//this.space

let DISPLAY_FLOWFIELD = false;

//global

let stars = [];

let particles = [];

// colors -- JS Object (data type)
let mandarin = {
  h: 17, //value pairs
  s: 67,
  b: 95,
  a: 0.1,
};

let lavender = {
  h: 273,
  s: 51,
  b: 91,
  a: 0.1,
};
let lightgreen = {
  h: 99,
  s: 46,
  b: 89,
  a: 0.1,
};
let kido = {
  h: 338,
  s: 24,
  b: 86,
  a: 0.1,
};

let maxSpeed = 1.0; // *****
let freqPos = 0.05; // *****
let freqTime = 0.01; // *****
let magnitude = 2.1; // *****

let radOscSize = 50; // ***** -- size of oscillation
let radOscSpd = 200; // ***** -- speed of oscillation

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.id("p5-canvas");
  background(28, 27, 71);

  button1 = createButton("create space");
  button1.mousePressed(createSpace);
  button1.size(200,100);
  button1.position(100,300);
  button1.style("font-family", "Gamja Flower");
  button1.style("font-size", "38px");

  button2 = createButton("erase space");
  button2.mousePressed(eraseSpace);
  button2.size(200,100);
  button2.position(1250,300);
  button2.style("font-family", "Gamja Flower");
  button2.style("font-size", "38px");


  //extraCanvas = createGraphics(windowWidth - 10, windowHeight - 10);
  //extraCanvas.clear();

  for (let i = 0; i < 300; i++) {
    stars[i] = new Star();
  }
}

function createSpace() {
  particles.push(new Particle(random(width), random(height), "ellipse", mandarin));
  particles.push(new Particle(random(width), random(height), "ellipse", lavender));
  particles.push(new Particle(random(width), random(height), "circle", lightgreen));
  particles.push(new Particle(random(width), random(height), "circle", kido));
}

function eraseSpace() {
    background(28, 27, 71, 20);
}

function draw() {
  //image(extraCanvas, 0, 0);
  //background(28, 27, 71);
  //if (keyIsPressed && key == " ") {
    //background(28, 27, 71, 20);
  //}

  ///fill(0, 255, 0);
  //textSize(40);
  //text(particles.length, 100, 100);

  // limit the number of the objects
  while (particles.length > 50 * 4) {
    particles.splice(0, 1);
  }

  // generate
  //if (mouseIsPressed) {
    //particles.push(new Particle(mouseX, mouseY, "ellipse", mandarin));
    //particles.push(new Particle(mouseX, mouseY, "ellipse", lavender));
    //particles.push(new Particle(mouseX, mouseY, "circle", lightgreen));
    //particles.push(new Particle(mouseX, mouseY, "circle", kido));
  //}



  // FLOW FIELDS
  if (DISPLAY_FLOWFIELD) {
    let gridSize = 20;
    for (y = 0; y < height; y += gridSize) {
      for (x = 0; x < width; x += gridSize) {
        let freqX = x * freqPos + frameCount * freqTime;
        let freqY = y * freqPos + frameCount * freqTime;
        let angle = map(noise(freqX, freqY), 0, 1, 0, TWO_PI * 2);

        stroke(0, 100);
        noFill();
        rect(x, y, gridSize, gridSize);
        push();
        translate(x + gridSize / 2, y + gridSize / 2);
        rotate(angle);
        line(0, 0, 10, 0);
        pop();
      }
    }
  }



  // OBJECTS

   for (let i = 0; i < stars.length; i++) {
    stars[i].draw();
  }

  push();
  //blendMode(ADD);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.flow();
    p.update();
    p.reappear();
    p.display();
  }
  pop();
}

//

class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(0.25, 3);
    this.t = random(TWO_PI);
    this.colorFreq = random(0.04, 0.09);
  }
  draw() {
    push();
    //this.t += 0.1;
    //let scale = this.size + sin(this.t) * 2;
    //let scale = 2;
    noStroke();
    //28, 27, 7
    let sinValue = sin(frameCount * this.colorFreq)
    let r = map(sinValue, -1, 1, 28, 255);
    let g = map(sinValue, -1, 1, 27, 255);
    let b = map(sinValue, -1, 1, 71, 255);
    fill(r, g, b);
    ellipse(this.x, this.y, this.size, this.size);
    pop();
  }
}

class Particle {
  constructor(x, y, t, c) {
    this.type = t;
    this.color = c; //{h, s, b, a}
    //
    this.pos = createVector(x, y);
    this.vel = createVector(1, 2);
    this.acc = createVector(1, 0);
    this.rad = random(0.5, 1.5); //0.5; // *****
    this.mass = 10;
    //
    this.colorSpd = random(0.01, 0.02);
    this.shapeRot = map(noise(frameCount * 0.01), 0, 1, 0.005, 0.05);
    this.radSize = random(radOscSize - 20, radOscSize + 20);
    this.radSpd = random(radOscSpd - 100, radOscSpd + 100);
    //
    this.d = dist(this.pos.x, this.pos.y, width / 2, height / 2);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //
    this.vel.limit(maxSpeed);
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }
  reappear() {
    // x
    if (this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    // y
    if (this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }
  bounce() {
    // x
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -2;
    } else if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x *= -2;
    }
    // y
    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y *= -2;
    } else if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y *= -2;
    }
  }
  flow() {
    let freqX = this.pos.x * freqPos + frameCount * freqTime;
    let freqY = this.pos.y * freqPos + frameCount * freqTime;
    if (this.type == "circle") {
      freqX *= 2.5;
      freqY *= 2.5;
    }
    let angle = map(noise(freqX, freqY), 0, 1, 0, TWO_PI * 2);
    let force = p5.Vector.fromAngle(angle);
    force.mult(magnitude); // *****
    this.applyForce(force);
  }
  display() {
    push();
    colorMode(HSB); // 360, 100, 100, 1.0
    if (this.type == "ellipse") this.drawEllipse();
    else if (this.type == "circle") this.drawCircle();
    colorMode(RGB); // 255, 255, 255, 255
    pop();
  }
  drawEllipse() {
    push();
    translate(this.pos.x, this.pos.y);
    let angle = map(sin(frameCount * this.shapeRot), -1, 1, -PI / 10, PI / 10);
    rotate(angle);
    noStroke();
    let hueFluc = sin(frameCount * this.colorSpd) * 30;
    if (this.d > width * 0.35) {
      fill(this.color.h + hueFluc * 4, this.color.s, this.color.b, 0.03);
    } else if (this.d > width * 0.25) {
      fill(this.color.h + hueFluc * 3, this.color.s, this.color.b, 0.04);
    } else if (this.d > width * 0.2) {
      fill(this.color.h + hueFluc * 2, this.color.s, this.color.b, 0.05);
    } else {
      fill(this.color.h + hueFluc, this.color.s, this.color.b, this.color.a);
    }
    //fill(this.color.h + hueFluc, this.color.s, this.color.b, this.color.a);
    let sinValue = sin(frameCount / this.radSpd) * this.radSize;
    ellipse(0, 0, this.rad * 2 + sinValue, this.rad * 2 + sinValue * 0.1);
    pop();
  }
  drawCircle() {
    push();
    //translate(this.pos.x, this.pos.y);
    //let angle = map(sin(frameCount * this.shapeRot), -1, 1, -PI / 100, PI / 100);
    //rotate(angle);
    noStroke();
    //
    let hueFluc = sin(frameCount * this.colorSpd) * 50;
    if (this.d > width * 0.35) {
      fill(this.color.h + hueFluc * 4, this.color.s, this.color.b, 0.05);
    } else if (this.d > width * 0.25) {
      fill(this.color.h + hueFluc * 3, this.color.s, this.color.b, 0.07);
    } else if (this.d > width * 0.2) {
      fill(this.color.h + hueFluc * 2, this.color.s, this.color.b, 0.09);
    } else {
      fill(this.color.h + hueFluc, this.color.s, this.color.b, this.color.a);
    }
    //fill(this.color.h + hueFluc, this.color.s, this.color.b, this.color.a);
    ellipse(this.pos.x, this.pos.y, this.rad * 2, this.rad * 2);
    pop();
  }
}

//

/////references

//Special Thanks For:
///Professor Moon

//Many Particle Systems (Emitters!) - The Nature of Code
///The Coding Train
///https://www.youtube.com/watch?v=wDYD3JVtOys

//Changes Over Time
///Allison Parrish
///https://creative-coding.decontextualize.com/changes-over-time/

//The Book of Shaders by Patricio Gonzalez Vivo & Jen Lowe
///Fractal Brownian Motion
////https://thebookofshaders.com/13/

//Domain Warping
////https://www.iquilezles.org/www/articles/warp/warp.htm
/////https://www.shadertoy.com/view/4s23zz

//Tom Holloway
/// Flow Fields and Noise Algorithms with P5.js
////https://dev.to/nyxtom/flow-fields-and-noise-algorithms-with-p5-js-5g67
////https://editor.p5js.org/nyxtom/sketches/uQCNclOBF

//David's Raging Nexus
///Perlin Noise - Flow Field
////https://ragingnexus.com/creative-code-lab/experiments/perlin-noise-flow-field/

//Sighack
///Getting Creative with Perlin Noise Fields
////https://sighack.com/post/getting-creative-with-perlin-noise-fields
