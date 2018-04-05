function createStarField() {
    var starsGeometry = new THREE.Geometry();
    for ( var i = 0; i < 1000; i ++ ) {
        var star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread( 1500 );
        star.y = THREE.Math.randFloatSpread( 1500 );
        star.z = THREE.Math.randFloatSpread( 1000 );
        starsGeometry.vertices.push( star );
    }
    var texture = createStarTexture();
    texture.needsUpdate = true;
    var starsMaterial = new THREE.PointsMaterial( { color: 0xffffbb, map: texture, size: 40} );
    var starField = new THREE.Points( starsGeometry, starsMaterial );
    return(starField);
}

function createStarSprites(){
    var sprites = new THREE.Object3D();
    var texture = createStarTexture();
    texture.needsUpdate = true;
    var material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
    for(let i = 0; i < 500; i++){
        var sprite = new THREE.Sprite(material);
        sprite.position.x =  THREE.Math.randFloatSpread( 1500 );
        sprite.position.y =  THREE.Math.randFloatSpread( 1500 );
        sprite.scale.set(20,20,1);
        sprites.add(sprite);
    }
    return(sprites);
}

function createStarTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 16;
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);

    gradient.addColorStop(0,    'rgba(255,255,255,.8)' );
    gradient.addColorStop(0.2,  'rgba(100,100,128,.6)' );
    gradient.addColorStop(0.4,  'rgba(64,64,128,.4)' );
    gradient.addColorStop(0.6,  'rgba(32,32,64,.2)' );
    gradient.addColorStop(1,    'rgba(0,0,0,0)' );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
    return(new THREE.Texture(canvas));
}
