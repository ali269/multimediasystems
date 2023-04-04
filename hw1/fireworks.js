let systems = [];

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
}

// events
function mouseClicked() {
  let system = new ParticleSystem(createVector(mouseX, mouseY));
  system.fire();
  explode.play();
  systems.push(system);
}

function draw() {
  background(51);
  // system.addParticle();
  for (let i = 0; i < systems.length; i++) {
    systems[i].run();
  }
}

// A simple Particle class
let Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-2, 2), random(-2, 2));
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

let ParticleSystem = function(position) {
  this.generate = 50;
  this.origin = position.copy();
  this.particles = [];
};


ParticleSystem.prototype.addParticle = function() {  
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.fire = function() {
  for (let i = 0; i < this.generate; i++) {
    this.addParticle();
  }
  // explode.play();
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
