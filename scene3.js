var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot;

var mesh1, mesh2, mesh3;

const myWidth = 960;
const myHeight = 540;

initialize();
animate();

function initialize()
{
  // array of functions for the rendering loop
  var onRenderFcts = [];
  // init scene and camera
	scene = new THREE.Scene();
  // Create a camera
	camera = new THREE.Camera();
  
	scene.add(camera);
  
  //add light
  let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
  
  //init renderer
	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
  
     // style of ar layer (css)
     renderer.setClearColor(new THREE.Color('white'), 0);//colour, transparancy
     renderer.setSize(myWidth, myHeight);
     //add jpeg background image and ocean gif as a background //first one goes on top
     renderer.domElement.style.background = "url('images/scene3/scene3.png'), url('images/scene3/scene3-wave-loop.gif'), url('images/scene3/scene3-background.png')";
     renderer.domElement.style.backgroundSize = "cover";   
     renderer.domElement.style.position = "absolute";
     renderer.domElement.style.top = "35px";
     renderer.domElement.style.left = "50%";
     renderer.domElement.style.margin = '0 0 0 -480px'; //centres the screen
     renderer.domElement.style.transform = "scaleX(-1)"; //flip the renderer Y axis(so that the user's motion is mirrored)
     document.body.appendChild(renderer.domElement);

  
	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;
  
	
	// handle arToolkitSource

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
    // resolution of at which we initialize in the source image
    sourceWidth: myWidth,
    sourceHeight: myHeight,
    // resolution displayed for the source
    displayWidth: myWidth/3,
    displayHeight: myHeight/3,
    });
  

	arToolkitSource.init(function onReady(){
		//onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		//onResize()
	});
	
  
  
	// initialize arToolkitContext

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para.dat',
		detectionMode: 'mono'
	});
	
	// initialize it
	arToolkitContext.init( function onCompleted(){
    // copy projection matrix to camera
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});
    // update artoolkit on every frame
    onRenderFcts.push(function() {
      if (arToolkitSource.ready === false) return;
      arToolkitContext.update(arToolkitSource.domElement);
    });

  
  
//marker and graphic

	// build markerControls
	markerRoot = new THREE.Group();
  markerRoot.name = "marker1";
	scene.add(markerRoot);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
		type: 'pattern', patternUrl: "data/hiro.patt",
	})
  
  // add a gizmo in the center of the marker
  var geometry = new THREE.OctahedronGeometry(0.1, 0);
  var material = new THREE.MeshNormalMaterial({
    wireframe: true
  });
  var mesh = new THREE.Mesh(geometry, material);
  markerRoot.add(mesh);

	   let loader = new THREE.TextureLoader();
  
  
    //Add all the images that the marker will display and use a mesh.visible = true/false; to control
  
     //adding the fisrt image - flag - flip the image
  
     //define a plane geometry that will seat on top of the marker  
     let geometry1 = new THREE.PlaneGeometry(0.8, 1.7, 1, 1); //width, height, widthsegmentation, heightsegmentation
	   let texture1 = loader.load( 'images/scene3/scene3-flag marker.png', render ); 
	   let material1 = new THREE.MeshBasicMaterial( { map: texture1 } ); 
	
	   mesh1 = new THREE.Mesh( geometry1, material1 );
	   mesh1.position.y = 0.1;
     mesh1.rotation.x = -Math.PI/2; //rotate so that if faces the screen
	
	   markerRoot.add( mesh1 );
  
     //adding the second image - boat top - flip the image  
  
     let geometry2 = new THREE.PlaneGeometry(3, 1.2, 1, 1);
	   let texture2 = loader.load( 'images/scene3/scene3-boatTop marker.png', render ); 
	   let material2 = new THREE.MeshBasicMaterial( { map: texture2 } ); 
	
	   mesh2 = new THREE.Mesh( geometry2, material2 );
	   mesh2.position.y = 0.1;
     mesh2.rotation.x = -Math.PI/2; //rotate so that if faces the screen
	
	   markerRoot.add( mesh2 );
  
     //adding the third image - boat base - flip the image  
  
     let geometry3 = new THREE.PlaneGeometry(2.8, 1.1, 1, 1);
	   let texture3 = loader.load( 'images/scene3/scene3-boatBase marker.png', render ); 
	   let material3 = new THREE.MeshBasicMaterial( { map: texture3 } ); 
	
	   mesh3 = new THREE.Mesh( geometry3, material3 );
	   mesh3.position.y = 0.1;
     mesh3.rotation.x = -Math.PI/2; //rotate so that if faces the screen
	
	   markerRoot.add( mesh3 );
  
  
     //hide the image for now
     mesh1.visible = false;
     mesh2.visible = false;
     mesh3.visible = false; 
  
}

//picks up a material when the marker is in the position of the material
function pickupAndDropoff() 
{
   //FLAG
   let pickupFlag = document.getElementById( 'pickupFlag' );
   //pick up a piece
   if (markerRoot.position.x > 2.4 && markerRoot.position.x < 2.8 && markerRoot.position.y > 0 && markerRoot.position.y < 1){
      console.log('DISPLAY');
      mesh1.visible = true;
      pickupFlag.style.display = "none";
   }
   //drop off a piece
   if (pickupFlag.style.display == "none" && markerRoot.position.x > -0.8 && markerRoot.position.x < -0.3 && markerRoot.position.y > -0.4 && markerRoot.position.y < 0.6 && markerRoot.position.z > -8 && markerRoot.position.z < -6){ 
      //^above code^ checks if the pickupflag img in the background has been disappeared
      console.log('HIDE');
      mesh1.visible = false;
      let dropoffFlag = document.getElementById( 'dropoffFlag' );
      dropoffFlag.style.display = "block";
   }
  
  
   //BOAT TOP
   let pickupBoatTop = document.getElementById( 'pickupBoatTop' );
   //pick up a piece
   if (markerRoot.position.x > -0.7 && markerRoot.position.x < 0.7 && markerRoot.position.y > 1.8 && markerRoot.position.y < 2.5){
      console.log('DISPLAY');
      mesh2.visible = true;
      pickupBoatTop.style.display = "none"; 
   }
   //drop off a piece
   if (pickupBoatTop.style.display == "none" && markerRoot.position.x > -0.2 && markerRoot.position.x < 0.2 && markerRoot.position.y > -1 && markerRoot.position.y < -0.8 && markerRoot.position.z > -8 && markerRoot.position.z < -6){ 
      console.log('HIDE');
      mesh2.visible = false;
      let dropoffBoatTop = document.getElementById( 'dropoffBoatTop' );
      dropoffBoatTop.style.display = "block";
   }
  
  
   //BOAT BASE
   let pickupBoatBase = document.getElementById( 'pickupBoatBase' );
   //pick up a piece
   if (markerRoot.position.x > -2.8 && markerRoot.position.x < -2.0 && markerRoot.position.y > -0.3 && markerRoot.position.y < 0.3){
      console.log('DISPLAY');
      mesh3.visible = true;
      pickupBoatBase.style.display = "none";
   }
   //drop off a piece
   if (pickupBoatBase.style.display == "none" && markerRoot.position.x > -0.2 && markerRoot.position.x < 0.2 && markerRoot.position.y > -1 && markerRoot.position.y < -0.8 && markerRoot.position.z > -8 && markerRoot.position.z < -6){ 
      console.log('HIDE');
      mesh3.visible = false;
      let dropoffBoatBase = document.getElementById( 'dropoffBoatBase' );
      dropoffBoatBase.style.display = "block";
   }
}




function update()
{
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
}

function render()
{
	renderer.render( scene, camera );
  console.log(markerRoot.position);
  pickupAndDropoff();
}

function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}


//text-plain javascript
//add subtitle to the scene

var app = document.getElementById('typeWriter');
var TypewriterWrapper;

var typewriter = new Typewriter(app, {
    loop: false,
    delay: 80, //writing speed
    wrapperClassName: TypewriterWrapper
});

typewriter.typeString('According to the map we just saw, ')
    .pauseFor(500)
    .typeString('my home is in the middle of the ocean 🌊')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('To get there, we need to build a <strong>Boat ⛵</strong>')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('Above, there are 3 pieces of material that could be assembled into a Boat')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('use the <strong>key</strong> to grab each material and place it in a right place')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('Ready?')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('lets build! 🔨')
    .start();
