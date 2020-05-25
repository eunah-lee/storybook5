var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1;

var mesh1, mesh2;

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
     renderer.domElement.style.background = "url('images/scene3/scene3-boatBackground.png'), url('images/scene3/scene3-wave-loop.gif'), url('images/scene3/scene3-background.png')";
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
	markerRoot1 = new THREE.Group();
  markerRoot1.name = "marker1";
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "data/hiro.patt",
	})
  
  // add a gizmo in the center of the marker
  var geometry = new THREE.OctahedronGeometry(0.1, 0);
  var material = new THREE.MeshNormalMaterial({
    wireframe: true
  });
  var mesh = new THREE.Mesh(geometry, material);
  markerRoot1.add(mesh);

  //define a plane geometry that will seat on top of the marker  
  let geometry1 = new THREE.PlaneGeometry(0.8, 1.7, 1, 1); //width, height, widthsegmentation, heightsegmentation
	let loader = new THREE.TextureLoader();
  
    //Add all the images that the marker will display and use a mesh.visible = true/false; to control
  
    //adding the fisrt image - flag - flip the image
	   let texture1 = loader.load( 'https://cdn.glitch.com/9e683993-4654-4440-aa0c-591511309c68%2Fscene3-flag-marker.png?v=1590434171743', render ); 
	   let material1 = new THREE.MeshBasicMaterial( { map: texture1 } ); 
	
	   mesh1 = new THREE.Mesh( geometry1, material1 );
	   mesh1.position.y = 0.1;
     mesh1.rotation.x = -Math.PI/2; //rotate so that if faces the screen
	
	   markerRoot1.add( mesh1 );
  
     mesh1.visible = false; //hide the image for now
  
}

//picks up a material when the marker is in the position of the material
function pickupAndDropoff() 
{
   //FLAG
   //pick up a piece
   if (markerRoot1.position.x > 2.0 && markerRoot1.position.x < 2.5 && markerRoot1.position.y > 0 && markerRoot1.position.y < 1){
     console.log('DISPLAY');
     mesh1.visible = true;
     let pickupFlag = document.getElementById( 'pickupFlag' );
     pickupFlag.style.display = "none";
   }
  //drop off a piece
  if(markerRoot1.position.x > -0.8 && markerRoot1.position.x < -0.3 && markerRoot1.position.y > -0.4 && markerRoot1.position.y < 0.6 ){ //&& markerRoot1.position.z > -7 && markerRoot1.position.z < -5
       console.log('HIDE');
       mesh1.visible = false;
       let dropoffFlag = document.getElementById( 'dropoffFlag' );
       dropoffFlag.style.display = "block";
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
  console.log(markerRoot1.position);
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

typewriter.typeString('<strong>Thank you ヽ(・∀・)ﾉ</strong> ')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('I had a map to home...')
    .pauseFor(1000)
    .typeString('but I lost it')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('But I heard that there is a <strong>key</strong> that will help us get through this adventure!')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('Have a look around')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('Do you see any <strong>key</strong> hidden somewhere in this screen?')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('try to click it and find out what happen!')
    .start();
