let DISPLAY_FLOWFIELD = false;
let freqPos = 0.005; // *****
let freqTime = 0.05; // *****

let particles = [];
let angles = [];

let fly;
let gif;
let page_mouseX = 0;
let page_mouseY = 0;


function updateMouse() {
  page_mouseX = event.clientX;
  page_mouseY = event.clientY;
}

function preload(){
  gif = createImg("js/assets/gif/butterfly2-1.gif");
  //Perlin Butterflies
  gifA = createImg("js/assets/gif/butterfly3.gif");
  gifB = createImg("js/assets/gif/butterfly3.gif");
  gifC = createImg("js/assets/gif/butterfly3.gif");
  gifD = createImg("js/assets/gif/butterfly3.gif");
}

function  setup() {
  let canvas = createCanvas(windowWidth - 5, windowHeight -5);
  canvas.id("p5-canvas");

   background(0, 0, 0, 0);

  fly = new Butterfly(windowWidth/2, windowHeight/2);

  //particles.push(new Particle(-200, -200));
  particles.push(new Particle(random(width), random(height), "gifA"));
  particles.push(new Particle(random(width), random(height), "gifB"));
  particles.push(new Particle(random(width), random(height), "gifC"));
  particles.push(new Particle(random(width), random(height), "gifD"));

}

function draw() {
//  background(0, 0, 0);

//generate
//if (mouseIsPressed) {
  //particles.push(new Particle(page_mouseX, page_mouseY, "gifC"));
  //particles.push(new Particle(page_mouseX, page_mouseY, "gifD"));
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

  //OBJECTS
  let target = createVector(page_mouseX, page_mouseY);
  fly.moveTo(target);
  fly.updatePosition();

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.flow();
    p.update();
    p.display();
    p.reappear();
    //p.bounce();
    p.lookTo();
  }
}

// CLASS BUTTERFLY

class Butterfly {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.angle = 0;
  }
  moveTo(target) {
    // target - currPos => direction!

    let offsetVec = createVector();
    offsetVec.x = cos(frameCount * 0.01) * 250;
    offsetVec.y = sin(frameCount * 0.01) * 250;
    target.add(offsetVec);

    let vector = p5.Vector.sub(target, this.pos);
    vector.normalize(); // make it as a unit vector
    vector.mult(2); // adjust the magnitude
    this.pos.add(vector); // we apply the vector to the position

    //this.angle = lerp(this.angle, degrees(vector.heading() + PI/2), 0.01);
    this.angle = degrees(vector.heading() + PI/2)
    /*
    targetAngle = atan2(emouseY - y, emouseX - x);
    currentAngle = lerpAngle(currentAngle, targetAngle, smoothSpeed);

    let target = createVector(emouseX, emouseY);
    let distance = target.dist(flyLocation);
    let mappedDistance = map(distance, 0, 5, 0.95, 1);

    target.sub(flyLocation);
    target.normalize(); // Normalize the vector to length 1 (make it a unit vector).
    target.mult(mappedDistance);

    flyLocation.add(target);
    */
  }
  updatePosition() {
    //gif.size(100, 100);
    //gif.position(this.x - 50, this.y - 50);
    gif.position(this.pos.x, this.pos.y);
    gif.elt.style.transform = "translate(-50%, -50%) scale(20%) rotate(" + this.angle + "deg";
    gif.elt.style.zIndex = "5000";
  }
}

//CLASS PARTICLE

class Particle {
  constructor(x, y, t) {
    this.type = t;
    //
    this.pos = createVector(x, y);
    this.vel = createVector(1, 2);
    this.acc = createVector(1, 0);
    this.rad = 2; // ***
    this.mass = 5;

    this.prevPos = this.pos.copy();
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //
    this.vel.limit(0.5); // ***
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }
  lookTo() {
    // target - currPos => direction!
    let target = createVector(this.pos.x, this.pos.y);

    let offsetVec = createVector();
    offsetVec.x = cos(frameCount * 0.01) * 100;
    offsetVec.y = sin(frameCount * 0.01) * 100;
    target.add(offsetVec);

    let vector = p5.Vector.sub(target, this.pos);
    vector.normalize(); // make it as a unit vector
    vector.mult(2); // adjust the magnitude
    this.pos.add(vector); // we apply the vector to the position

    //this.angle = lerp(this.angle, degrees(vector.heading() + PI/2), 0.01);
    this.angle = degrees(vector.heading() + PI/2)
  }
  display() {
    push();
    if (this.type == "gifA") this.drawGifA();
    else if (this.type == "gifB") this.drawGifB();
    else if (this.type == "gifC") this.drawGifC();
    else if (this.type == "gifD") this.drawGifD();
    pop();
  }
  drawGifA() {
    gifA.position(this.prevPos.x, this.prevPos.y);
    gifA.elt.style.transform = "translate(-50%, -50%) scale(10%) rotate(" + this.angle + "deg";
    gifA.elt.style.opacity = "0.25";


    this.updatePrev();
  }
  drawGifB() {
    gifB.position(this.prevPos.x, this.prevPos.y);
    gifB.elt.style.transform = "translate(-50%, -50%) scale(20%) rotate(" + this.angle + "deg";
    gifB.elt.style.opacity = "0.25";

    this.updatePrev();
  }
  drawGifC() {
    gifC.position(this.prevPos.x, this.prevPos.y);
    gifC.elt.style.transform = "translate(-50%, -50%) scale(15%) rotate(" + this.angle + "deg";
    gifC.elt.style.opacity = "0.25";

    this.updatePrev();
  }
  drawGifD() {
    gifD.position(this.prevPos.x, this.prevPos.y);
    gifD.elt.style.transform = "translate(-50%, -50%) scale(10%) rotate(" + this.angle + "deg";
    gifD.elt.style.opacity = "0.25";

    this.updatePrev();
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }
  reappear() {
    // x
    if (this.pos.x < 0 + 30) {
      this.pos.x = width - 30;
    } else if (this.pos.x > width - 30) {
      this.pos.x = 0 + 30;
    }
    // y
    if (this.pos.y < 0 + 30) {
      this.pos.y = height - 30;
    } else if (this.pos.y > height - 30) {
      this.pos.y = 0 + 30;
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
    let angle = map(noise(freqX, freqY), 0, 1, 0, TWO_PI * 2);
    let force = p5.Vector.fromAngle(angle);
    force.mult(0.1); // ***
    this.applyForce(force);
  }
}

//Function Launcher pew pew

function someFunc() {
    flip(event);
    play();
    //randomSong();
    //playAudio();
}

//flip event
function flip(event){
  let element = event.currentTarget;
  if (element.className === "card") {
    if(element.style.transform == "rotateY(180deg)") {
      element.style.transform = "rotateY(0deg)";
    }
    else {
      element.style.transform = "rotateY(180deg)";
    }
  }
};

//play event
function play() {
        var audio = document.getElementById("audio1");
        audio.play();
      };
