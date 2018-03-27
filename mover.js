//creates ball objects when called w/ new
function Mover(radius, loc, vel, acc, color, texture){
  this.radius = radius;
  this.color = color;
  //let volume = area and density = 1, so mass = area
  this.mass = Math.PI * this.radius * this.radius;
  this.loc = loc;
  this.vel = vel;
  this.acc = acc;

  // this.x_rot = Math.random()*2*Math.PI;
  // this.y_rot = Math.random()*2*Math.PI;
  // this.z_rot = Math.random()*2*Math.PI;

  // create a threejs sphere with radius, widthSegments, heightSegments = 100
  var geometry = new THREE.SphereGeometry( this.radius, 100, 100);

  var material = new THREE.MeshLambertMaterial( { color: this.color, map: texture } );
  // The mesh is what threejs needs in the scene
  this.mesh = new THREE.Mesh( geometry, material );
  this.mesh.position.x = this.loc.x;
  this.mesh.position.y = this.loc.y;
  this.mesh.rotation.set(Math.random()*2*Math.PI,Math.random()*2*Math.PI,Math.random()*2*Math.PI);
}

Mover.prototype.momentum = function(){
  return vector2d.scalarMult(this.vel, this.mass);
}

Mover.prototype.kineticEnergy = function(){
  var v = this.vel.magnitude();
  return this.mass * v * v / 2;
}

//updates ball position
Mover.prototype.update = function () {
  this.checkEdges();
  this.loc.add(this.vel);
  this.vel.add(this.acc);
  this.mesh.position.x = this.loc.x;
  this.mesh.position.y = this.loc.y;
  this.mesh.rotation.x += 0.05;
  this.mesh.rotation.y += 0.05;
  this.mesh.rotation.z += 0.05;
}

//reverses direction when ball hits edge
Mover.prototype.checkEdges = function () {
  if(this.loc.x + this.radius >= canvas.width){
    this.loc.x = canvas.width - this.radius;
    this.vel.x *= -1;
  }
  if(this.loc.x - this.radius < 0){
    this.loc.x = this.radius;
    this.vel.x *= -1;
  }
  if(this.loc.y + this.radius >= canvas.height){
    this.loc.y = canvas.height - this.radius;
    this.vel.y *= -1;
  }
  if(this.loc.y - this.radius < 0){
    this.loc.y = this.radius;
    this.vel.y *= -1;
  }
}

// //draws ball
// Mover.prototype.draw = function () {
//   this.update();
//   ctx.beginPath();
//   ctx.arc(this.loc.x, this.loc.y, this.radius, 0, Math.PI * 2);
//   ctx.fillStyle = this.color;
//   ctx.fill();
// };
