window.addEventListener('load', load); // Wait for the page to load before we begin animation
var renderer;
var scene;
var camera;
var balls = [];
var num_balls = 10;
var canvas;
var textures = {};

// Use promises to load all the textures from image files
function load() {
    Promise.all([
        new Promise(function (resolve, reject) {
            new THREE.TextureLoader().load("images/PlanetTestRender0001.png",
                function(texture) { resolve(texture);}, undefined,
                function(err) { reject()} );
        }),
        new Promise(function (resolve, reject) {
            new THREE.TextureLoader().load("images/PlanetTestRender0002.png",
                function(texture) { resolve(texture);}, undefined,
                function(err) { reject()} );
        }),
        new Promise(function (resolve, reject) {
            new THREE.TextureLoader().load("images/PlanetTestRender0003.png",
                function(texture) { resolve(texture);}, undefined,
                function(err) { reject()} );
        }),
        new Promise(function (resolve, reject) {
            new THREE.TextureLoader().load("images/PlanetTestRender0004.png",
                function(texture) { resolve(texture);}, undefined,
                function(err) { reject()} );
        }),
        new Promise(function (resolve, reject) {
            new THREE.TextureLoader().load("images/PlanetTestRender0005.png",
                function(texture) { resolve(texture);}, undefined,
                function(err) { reject()} );
        }),
        new Promise(function (resolve, reject) {
            new THREE.TextureLoader().load("images/PlanetTestRender0006.png",
                function(texture) { resolve(texture);}, undefined,
                function(err) { reject()} );
        }),
        new Promise(function (resolve, reject) {
            new THREE.TextureLoader().load("images/PlanetTestRender0007.png",
                function(texture) { resolve(texture);}, undefined,
                function(err) { reject()} );
        }),
        new Promise(function (resolve, reject) {
            new THREE.TextureLoader().load("images/PlanetTestRender0008.png",
                function(texture) { resolve(texture);}, undefined,
                function(err) { reject()} );
            }),
        new Promise(function (resolve, reject) {
            new THREE.TextureLoader().load("images/PlanetTestRender0009.png",
                function(texture) { resolve(texture);}, undefined,
                function(err) { reject()} );
        }),
        new Promise(function (resolve, reject) {
            new THREE.TextureLoader().load("images/PlanetTestRender0010.png",
                function(texture) { resolve(texture);}, undefined,
                function(err) { reject()} );
        })
    ]).then(function(txtrs){
        textures.planet1 = txtrs[0];
        textures.planet2 = txtrs[1];
        textures.planet3 = txtrs[2];
        textures.planet4 = txtrs[3];
        textures.planet5 = txtrs[4];
        textures.planet6 = txtrs[5];
        textures.planet7 = txtrs[6];
        textures.planet8 = txtrs[7];
        textures.planet9 = txtrs[8];
        textures.planet10 = txtrs[9];

        init();
    });
}

function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( 900, 600 );   // the canvas size
    canvas = renderer.domElement; //get the canvas
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(96, 96, 96)");

    // White directional light at full intensity shining from directly above.
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.8 );
    // directionalLight.position.x = canvas.width/2;
    // directionalLight.position.y = canvas.height/2;
    directionalLight.position.z = 10;
    scene.add( directionalLight );

    // A camera angle of view of 30 degrees and a z position of
    // 1130 approximates one scene coordinate unit to
    // one pixel.
    camera = new THREE.PerspectiveCamera( 30,
        canvas.width/canvas.height, 100, 2000 );
	camera.position.z = 1130;
    // Move the camera so that the origin of the coordinates
    // is in the bottom left of the camera's frustrum
    // rather than the center.  Threejs has positive y values
    // going up rather than down so the origin should be
    // lower left rather than upper right.
    camera.position.x = canvas.width/2;
    camera.position.y = canvas.height/2;


    // Set some styles of the canvas
    canvas.style.marginTop = canvas.height * 0.08 + 'px';
    canvas.style.marginBottom = canvas.height * 0.08 + 'px';
    canvas.style.marginRight = canvas.width * 0.08 + 'px';
    canvas.style.marginLeft = canvas.width * 0.08 + 'px';
    canvas.style.border = 'solid black 2px';


        // create array of balls where no ball is created overlapping
    // any other ball.
    for (var i = 0; i < num_balls; i++){
     var ball;
     while(true) {
         var radius = Math.random()*30 + 25;
         var color = randomColor();
         //set location vector
         var x = Math.random() * (canvas.width-2*radius) + radius;
         var y = Math.random() * (canvas.height-2*radius) + radius;
         var loc = new vector2d(x, y);
         //set velocity vector
         var r = (Math.random()* 4 + 0.5);
         var theta = Math.random() * 2 * Math.PI;
         var vel = new vector2d(undefined, undefined, r, theta);
         var acc = new vector2d(0, 0);
         ball = new Mover(radius, loc, vel, acc, color, textures["planet"+(i+1)]);
         // check that this new ball does not collide with any other ball
         for(var j = 0;  j < balls.length; j++){
             if(vector2d.distance(balls[j].loc,ball.loc) <= (balls[j].radius + ball.radius))
                 break;  // collision
         }
         if(j === balls.length)
             break;  // no collision
         }

     balls[i] = ball;
     scene.add(ball.mesh);
     }

    logEnergy();


    // Hide the loading screen and show the wrapper div.
    // Dont add the canvas to the wrapper div
    // until now or it will appear prematurely
    let loaderDiv = document.getElementById('loader');
    loaderDiv.style.display = 'none';
    var wrapperDiv = document.getElementById('wrapper');
    wrapperDiv.styledisplay = 'block';
    wrapperDiv.appendChild( canvas );
    animate();

}

function animate() {
    requestAnimationFrame( animate );
    checkBallBounces();
    for(let i = 0; i < balls.length; i++)
        balls[i].update(i);
    renderer.render(scene, camera);
};


//
function logEnergy() {
    console.log(`totalKineticEnergy ${totalKineticEnergy().toFixed(2)}`);
    setTimeout(logEnergy, 5000);  // five seconds
}

function totalKineticEnergy() {
  var sum = 0;
  for(var i = 0; i < balls.length; i++){
    sum += balls[i].kineticEnergy();
  }
  return sum;
}

//returns a random pastel color
// Laurel likes pastels
function randomColor(){
  let red = Math.floor(Math.random()*64 + 192);
  let blue = Math.floor(Math.random()*64 + 192);
  let green = Math.floor(Math.random()*64 + 192);
  let pastel = `rgb(${red},${blue},${green})`
  return pastel;
}

// Check if balls should bounce off each other.
// This where we have the collision code.
// A collision between two balls is not so much between the
// the two balls as it is between each ball and the
// center of mass (cm) which has its own velocity.
// The velocities of each ball and the cm can be broken down
// into two components where one component is in the direction
// of the collision and one component is orthogonal to the
// collision.  Each orthogonal component contributes no energy
// to the collision but the energy that it does have must be
// conserved.
// The center of mass and the collision itself all lie on a
// line connecting the center of the two colliding bodies.
// The laws of physics say that the total momentum (mass * velocity)
// and the total kinetic energy (1/2 mass * velocity * velocity)
// after an elastic collision must be the same as before the collision.

function checkBallBounces () {

  for(var i = 0; i < balls.length ; i++){
    for(var j = i + 1; j < balls.length; j++){

      //check if edges of 2 balls are touching
      var dist = vector2d.distance(balls[i].loc, balls[j].loc);
      if( dist <= balls[i].radius + balls[j].radius){
        var b1 = balls[i];      // ball one
        var b2 = balls[j];      // ball two

        // sometimes the balls will stick together if there is
        // too much overlap initially.  So separate them enough
        // that they are just touching.
        var vec = vector2d.subtract(b1.loc, b2.loc);
        vec.setMag((b1.radius+b2.radius - vec.magnitude())/2);
        b1.loc.add(vec);
        vec.scalarMult(-1);
        b2.loc.add(vec);

        // momentum & velocity of center of mass
        // find the total initial momentum (p) before the collision
        var p_initial = vector2d.add(b1.momentum(), b2.momentum());
        var total_mass = b1.mass + b2.mass;
        // The velocity of the center of mass (vel_cm) is the
        // total momentum divided the total mass.
        var vel_cm = vector2d.scalarDiv(p_initial, total_mass);

        // To solve for the final velocities of ball one and ball two,
        // we need to find the following things.
        // 1. The component of ball one's initial velocity (vel_b1) that is
        // in the direction of the center of mass (vel_b1_cm).
        // 2. The component of ball two's initial velocity (vel_b2) that is
        // in the direction of the center of mass (vel_b2_cm).
        // 3. The component of the center of mass's velocity that is in the direction
        // of b1 (vel_cm_b1), which is also the component of the center
        // of mass's velocity in the direction of b2 since they all lie on the
        // same line. The sign is opposite for the two balls because if the
        // center of mass is moving toward one of the balls it is moving
        // away from the other ball.
        // 4. The component of ball one's initial velocity orthogonal to the direction
        // of the center of mass (vel_b1_not_cm).  This velocity is not part of
        // the collision but must be conserved and added back in the end.
        // 5. The component of ball two's initial velocity orthogonal to the direction
        // of the center of mass (vel_b2_not_cm)
        //
        // vel_b1_cm is the magnitude of ball one's initial velocity times
        // the cosine of the angle between its velocity and the direction
        // to the center of mass.  vel_b1_not_cm is the sine of the angle
        // between or the difference between ball one's initial velocity
        // and vel_b1_cm.
        // vel_b2_cm is the magnitude of ball two's initial velocity times
        // the cosine of the angle between its velocity and the direction
        // of the center of mass.  vel_b2_not_cm is the sine of the angle
        // between or the difference between ball two's initial velocity
        // and vel_b2_cm.
        // vel_cm_b1 is the magnitude of the center of mass's velocity times
        // the cosine of the angle between its velocity and the direction
        // of ball one.


        // Where is the center of mass?  It must lie on a line
        // connecting the two colliding objects at a point
        // proportionate to the two masses.
        var vec_cm = vector2d.subtract(b1.loc, b2.loc);
        vec_cm.setMag(vec_cm.magnitude() * (b1.mass/(b1.mass+b2.mass)));
        vec_cm.add(b2.loc); // location of CM

        // For each ball, what is the component of its velocity towards
        // the center of mass and what is the component that is not
        // in the direction of the center of mass?

        // get a vector from  ball 1 to the center of mass
        var vel_b1_cm = vector2d.subtract(vec_cm, b1.loc);
        // its magnitude should be the magnitude of the balls velocity
        // times the cosine of the angle between itself and the
        // velocity of the ball
        // component of b1 velocity on a line to the CM
        vel_b1_cm.setMag(b1.vel.magnitude() * Math.cos(vector2d.angleBetween(b1.vel,vel_b1_cm)));
        // component of the CM's velocity on a line towards b1
        var vel_cm_b1 = vector2d.copy(vel_b1_cm); // on the same line as vel_b1_cm
        vel_cm_b1.setMag(vel_cm.magnitude() * Math.cos(vector2d.angleBetween(vel_cm,vel_cm_b1)));
        // The component of the ball's velocity not in the direction of the
        // center of mass should be the difference between its total velocity
        // and the component in the direction of the center of mass
        var vel_b1_not_cm = vector2d.subtract(b1.vel,vel_b1_cm);

        // Now repeat for the second ball
        var vel_b2_cm = vector2d.subtract(vec_cm, b2.loc);
        vel_b2_cm.setMag(b2.vel.magnitude() * Math.cos(vector2d.angleBetween(b2.vel,vel_b2_cm)));
        var vel_b2_not_cm = vector2d.subtract(b2.vel,vel_b2_cm);

        //calculate final velocities after collision using vf = 2*v_cm - vi
        //http://courses.ncssm.edu/apb11o/resources/guides/G09-4b.com.htm

        var v1_final = vector2d.scalarMult(vel_cm_b1, 2); // 2 times the velocity of cm
        v1_final.subtract(vel_b1_cm);   // subtract b1's velocity towards the CM
        v1_final.add(vel_b1_not_cm);    // add back b1's velocity not towards the CM

        var v2_final = vector2d.scalarMult(vel_cm_b1, 2);
        v2_final.subtract(vel_b2_cm);   // subtract velocity towards the CM
        v2_final.add(vel_b2_not_cm);    // add back the velocity not towards the CM


        b1.vel = v1_final;  // the final velocities after the collision
        b2.vel = v2_final;

        // note the total momentum after the collision
        // which should be equal to p_initial
        var p_final = vector2d.add(b1.momentum(), b2.momentum());
        // console.log(`initial momentum ${p_initial}`);
        // console.log(`final momentum ${p_final}`);

      }
    }
  }

}
