let explosions = [];
let whistles = [];
let test_whistle;
let explode;

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
  test_whistle = new Whistle(createVector(500, 500));
}

// Actions
function explosion(position) {
  let system = new ParticleSystem(position);
  system.fire();
  explode.play();
  explosions.push(system);
}

function strikeWhistle(position) {
  let whistle = new Whistle(position);
  whistles.push(whistle);
}

// Events
function mousePressed() {
  // if (mouseY > 500) {
  //   strikeWhistle(createVector(mouseX, mouseY));
  // }
  test_whistle = new Whistle(createVector(mouseX, mouseY));
}

function mouseReleased() {
  test_whistle.powerOff();
}

function draw() {
  background(51);
  test_whistle.run();
  for (let i = 0; i < whistles.length; i++) {
    whistles[i].run();
  }

  for (let i = 0; i < explosions.length; i++) {
    explosions[i].run();
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

//#region 
let Whistle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-2, -4));
  this.position = position.copy();
  this.color = colors[parseInt(random(0, 8))];
  this.haspower = true;
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
//#endregion