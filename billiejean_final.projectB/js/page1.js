let DISPLAY_FLOWFIELD = false;
let freqPos = 0.005; // *****
let freqTime = 0.05; // *****

let particles = [];
let angles = [];

//let fly;
let gif;
let page_mouseX = 0;
let page_mouseY = 0;


function updateMouse() {
  page_mouseX = event.clientX;
  page_mouseY = event.clientY;
}

function preload(){
  //gif = createImg("js/assets/gif/butterfly2-1.gif");
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

//  fly = new Butterfly(windowWidth/2, windowHeight/2);

  //particles.push(new Particle(-200, -200));
  particles.push(new Particle(random(width), random(height), "gifA"));
  particles.push(new Particle(random(width), random(height), "gifB"));
  particles.push(new Particle(random(width), random(height), "gifC"));
  particles.push(new Particle(random(width), random(height), "gifD"));
}

function draw() {
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

const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

let state = {}

function startGame() {
  state = {}
  showTextNode(1) //Starting text node
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  textElement.innerText = textNode.text
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('btn')
      button.addEventListener('click', () => selectOption(option))
      optionButtonsElement.appendChild(button)
    }
  })
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
  const nextTextNodeId = option.nextText
  if (nextTextNodeId <= 0) {
    return startGame()
  }
  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
}

const textNodes = [
  {
    id: 1,
    text: '"Bang." "Bang." "Bang." The repeated crack of a white-knuckle fist rings out, stirring you from your deep slumber. ',
    options: [
      {
        text: 'Sleep',
        setState: { neutral: true },
        nextText: 2
      },
      {
        text: '',
        setState: { noOption: true },
      },
      {
        text: '',
        setState: { noOption: true },
      },
      {
        text: '',
        setState: { noOption: true },
      }
    ]
  },
  {
    id: 2,
    text: 'Brows furrowing, you curl tighter into the warmth of your covers, a sweet and pervasive darkness lulling you back to sleep.',
    options: [
      {
        text: 'Sleep',
        setState: { neutral: true },
        nextText: 3
      },
      {
        text: '',
        setState: { noOption: true },
      },
      {
        text: '',
        setState: { noOption: true },
      },
      {
        text: '',
        setState: { noOption: true },
      }
    ]
  },
  {
    id: 3,
    text: '"Bang." "Bang." "Bang." You lurch forward, warmth leaving your body as the aggrivated bark of an indecipherable demand prickles your ears.',
    options: [
      {
        text: 'Sleep',
        setState: { neutral : true },
        nextText: 4
      },
      {
        text: 'Get Up',
        setState: { neutral : true },
        nextText: 5
      },
      {
        text: '',
        setState: { noOption: true },
        //nextText:
      },
      {
        text: '',
        setState: { noOption: true },
        //nextText:
      }
    ]
  },
  {
    id: 4,
    text: 'Guilt sits heavy on your shoulders, you know who it was that came so late in the night... The Watchmen. It was none of your concern though, was it?',
    options: [
      {
        text: 'Sleep',
        setState: { happy: true },
        nextText: 6
      },
      {
        text: 'Get Up',
        //nextText:
        setState: { chaotic: true },
        nextText: 5
      },
      {
        text: '',
        setState: { noOption: true },
        //nextText:
      },
      {
        text: '',
        setState: { noOption: true },
        //nextText:
      }
    ]
  },
  {
    id: 5,
    text: 'The bed creeks as you lift yourself from it, your feet shifting on the cold floor. "Crack!" The sound of a door slamming open echoes from outside of the apartment.',
    options: [
      {
        text: 'Back to Sleep',
        setState: { happy: true },
        nextText: 6
      },
      {
        text: 'Go Look',
        //nextText:
        setState: { chaotic: true },
        nextText: 6
      },
      {
        text: '',
        setState: { noOption: true },
        //nextText:
      },
      {
        text: '',
        setState: { noOption: true },
        //nextText:
      }
    ]
  },
  {
    id: 6,
    text: 'To Be Continued',
    options: [
      {
        text: '',
        setState: { happy: true },
      },
      {
        text: '',
        //nextText:
        setState: { chaotic: true },
      },
      {
        text: '',
        setState: { noOption: true },
        //nextText:
      },
      {
        text: '',
        setState: { noOption: true },
        //nextText:
      }
    ]
  },

]

startGame()
