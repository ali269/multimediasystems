let explosions = [];
let whistleSystem;
let currentActiveWhistle = '';
let randomLifeTime;

let lrstage;
let rlstage;
let lrwait;
let rlwait;

let explode;
let whistleSound;

const colors = [
  [204, 67, 24],
  [251, 131, 15],
  [255, 180, 0],
  [0, 166, 237],
  [64, 175, 119],
  [127, 184, 0],
  [99, 149, 21],
  [13, 44, 84]
]


function setup() {
  createCanvas(1200, 812);
  explode = loadSound("./sound/explode.mp3");
  whistleSound = loadSound("./sound/fire.mp3");
  whistleSystem = new WhistleSystem();
  randomLifeTime = 0;
  lrstage = rlstage = 0;
  lrwait = rlwait = 0;
}

function draw() {
  background(51);
  randomGenerator();
  whistleSystem.run();
  swingHandler();
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].run();
  }
  randomLifeTime -= 1;
  lrwait -= 1;
  rlwait -= 1;
}
// Actions
function explosion(position) {
  let system = new ParticleSystem(position);
  system.fire();
  explode.play();
  explosions.push(system);
}

function fireWhistle(position) {
  whistleSystem.addWhistle(position);
  whistleSound.play();
  whistleSystem.powerOff();
}

function randomGenerator() {
  if (random(0, 10) >= 5 && randomLifeTime <= 0) {
    fireWhistle(createVector(random(0, 1200), random(300, 750)));
    randomLifeTime = 255;
  }
  else if (randomLifeTime <= 0) {
    randomLifeTime = 25;
  }
}

function key1Handler() {
  let num = parseInt(random(10, 20));
  for (let i = 0; i < num; i++) {
    fireWhistle(createVector(random(0, 1200), random(300, 750)));
  }
}

function swingHandler() {
  if (lrstage > 0 && lrwait <= 0) {
    lrwait = 25;
    for (let i = 0; i < 3; i++) {
      fireWhistle(createVector(1200 - lrstage * 100 + random(0, 100), random(300, 750)));
    }
    lrstage -= 1;
  }
  if (rlstage > 0 && rlwait <= 0) {
    rlwait = 25;
    for (let i = 0; i < 3; i++) {
      fireWhistle(createVector(rlstage * 100 - random(0, 100), random(300, 750)));
    }
    rlstage -= 1;
  }
}

function key2Handler() {
  lrstage = 12;
}

function key3Handler() {
  rlstage = 12;
}




// Events
function mousePressed() {
  whistleSystem.addWhistle(createVector(mouseX, mouseY));
  whistleSound.play();
}

function mouseReleased() {
  whistleSystem.powerOff();
}

function keyTyped() {
  if (keyCode === 49) {
    key1Handler();
  }
  if (keyCode === 50) {
    key2Handler();
  }
  if (keyCode === 51) {
    key3Handler();
  }
}


// Classes

//#region A simple Particle
let Particle = function(position, initVelocity) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = initVelocity;
  this.position = position.copy();
  this.color = colors[parseInt(random(0, colors.length))];
  this.lifespan = 255;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  stroke(200);
  strokeWeight(0);
  const [r, g, b] = this.color;
  const opacity = this.lifespan > 0 ? this.lifespan / 255 : 0;
  console.log(r, g, b);
  fill(`rgba(${r}, ${g}, ${b}, ${opacity})`);
  ellipse(this.position.x, this.position.y, 3, 3);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  return this.lifespan < 0;
};

//#endregion

//#region A simple Particle System
let ParticleSystem = function(position) {
  this.generate = 50;
  this.origin = position.copy();
  this.particles = [];
};


ParticleSystem.prototype.addParticle = function() {  
  this.particles.push(new Particle(this.origin, createVector(random(-2, 2), random(-2, 2))));
};

ParticleSystem.prototype.fire = function() {
  for (let i = 0; i < this.generate; i++) {
    this.addParticle();
  }
}

ParticleSystem.prototype.run = function() {
  for (let i = this.particles.length-1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};
//#endregion

//#region A simple Whistle
let Whistle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-2, -6));
  this.position = position.copy();
  this.color = colors[parseInt(random(0, 8))];
  this.haspower = true;
}

Whistle.prototype.getPosition = function() {
  return this.position.copy();
}

Whistle.prototype.powerOff = function() {
  this.haspower = false;
}

Whistle.prototype.run = function() {
  this.update();
  this.display();
}

Whistle.prototype.update = function() {
  if (!this.haspower) {
    this.velocity.add(this.acceleration);
  }
  this.position.add(this.velocity);
  this.lifetime += 1;
}

Whistle.prototype.display = function() {
  stroke(200);
  strokeWeight(0);
  const [r, g, b] = this.color;
  console.log(r, g, b);
  fill(`rgb(${r}, ${g}, ${b})`);
  ellipse(this.position.x, this.position.y, 6, 6);
  ellipse(this.position.x - this.velocity.x, 
    this.position.y - this.velocity.y, 5, 5);
  ellipse(this.position.x - 2 * this.velocity.x, 
    this.position.y - 2 * this.velocity.y, 4, 4);
  ellipse(this.position.x - 3 * this.velocity.x, 
    this.position.y - 3 * this.velocity.y, 3, 3);
  ellipse(this.position.x - 4 * this.velocity.x, 
    this.position.y - 4 * this.velocity.y, 2, 2);
}

Whistle.prototype.isDead = function() {
  return Math.abs(this.velocity.y) < 0.15 || this.position.y < 100;
}
//#endregion

//#region A simple WhistleSystem
let WhistleSystem = function() {
  this.whistles = [];
}

WhistleSystem.prototype.addWhistle = function(position) {
  let wh = new Whistle(position);
  this.whistles.push(wh);
}

WhistleSystem.prototype.powerOff = function() {
  let idx = this.whistles.length - 1;
  this.whistles[idx].powerOff();
}

WhistleSystem.prototype.run = function() {
  for(let i = 0; i < this.whistles.length; i++) {
    this.whistles[i].run();
    if (this.whistles[i].isDead()) {
      explosion(this.whistles[i].getPosition());
      this.whistles.splice(i, 1);
    }
  }
}

//#endregion
