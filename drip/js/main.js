var FPS = 60;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaaa);
document.body.appendChild(renderer.domElement);

var ORIGIN = new THREE.Vector3(0, 0, 0);
camera.position.copy(new THREE.Vector3(200, 100, 175));
camera.lookAt(ORIGIN);

var COLORS = [
 0x0035E4,
 0x16359B,
 0x415494,
 0xDA5D50,
 0xFF7C00
];

var Cube = function(color) {
  this.color = color;
  this.rate = -0.1 * Math.random() - 0.4;
  this.delta = 1 + Math.random() * 0.05;
  this.delay = Math.random() * 40;
  var geometry = new THREE.BoxGeometry(10, 10, 10, 3, 3, 3);
  var material = new THREE.MeshBasicMaterial({
    color: this.color,
    wireframe: true
  });
  THREE.Mesh.call(this, geometry, material);
};
Cube.prototype = Object.create(THREE.Mesh.prototype);
Cube.prototype.constructor = Cube;

Cube.prototype.animate = function(frame) {
  if (frame / FPS < this.delay) {
    return;
  }
  if(!this.exploded) {
    this.rate *= this.delta;
    this.position.y += this.rate;
    if (this.position.y - 10 <= 0) {
      this.explode(frame);
      this.exploded = true;
    }
  } else {
    for (var i=0; i<this.particles.length; i++) {
      this.particles[i].animate(frame);
    }
  }
}

Cube.prototype.explode = function(frame) {
  scene.remove(this);

  this.particles = [];
  var num_parts = Math.floor(Math.random() * 10) + 20;
  for (var i=0; i<num_parts; i++) {
    var particle = new Particle(frame, this.position, this.color);
    scene.add(particle);
    this.particles.push(particle);
  }
};


var Particle = function(start_frame, start_pos, color) {
  this.start = start_frame;
  this.color = color;
  this.theta = Math.random() * 6.28;
  this.d = Math.random() * 20 + 15;
  this.s = Math.random() * 5 + 5;
  this.r = Math.random() * 5;
  var geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  var material = new THREE.MeshBasicMaterial({
    color: this.color,
  });
  THREE.Mesh.call(this, geometry, material);
  this.position.copy(start_pos);
  this.orig_x = start_pos.x;
  this.orig_z = start_pos.z;
};
Particle.prototype = Object.create(THREE.Mesh.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.animate = function(frame) {
  var i = frame - this.start;
  if (i > 500) {
    scene.remove(this);
  }
  this.position.x = Math.cos(this.theta) * i + this.orig_x;
  this.position.z = Math.sin(this.theta) * i + this.orig_z;
  this.position.y = this.d - Math.pow(i/this.s - this.r, 2);
};


var cubes = [];
var base = 6;
var spacing = 24;
var total_space = base * spacing;
for(var i=0; i<base; i++) {
  for(var j=0; j<base; j++) {
    var cube = new Cube(COLORS[Math.floor(Math.random() * COLORS.length)]);
    cube.position.x = -1 * total_space/2 + i * spacing;
    cube.position.z = -1 * total_space/2 + j * spacing;
    cube.position.y = 100;
    scene.add(cube);
    cubes.push(cube);
  }
}

var geometry = new THREE.PlaneGeometry(500, 500);
var material = new THREE.MeshBasicMaterial({
  color: 0x333333,
  side: THREE.DoubleSide
});
var plane = new THREE.Mesh( geometry, material );
plane.rotation.x = 3.14/2;
scene.add( plane );

var t = 0;
var secs = 0;
var frame = 0;
var collision = false;
function render() {
  setTimeout(function() {
    requestAnimationFrame( render );
  }, 1000 / FPS);

  camera.position.x = 150 * Math.sin(t);
  camera.position.z = 150 * Math.cos(t);
  camera.lookAt(ORIGIN);
  
  t += 0.005;
  if (t > 6.28) {
    t = 0;
  }
  for (var i=0; i<cubes.length; i++) {
    cube = cubes[i];
    cube.animate(frame);
  }

  renderer.render(scene, camera);
  frame++;
}
render();
