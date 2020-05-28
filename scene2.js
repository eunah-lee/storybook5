var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot;

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
     renderer.domElement.style.background = "url('images/scene2/scene2-wave-loop.gif'), url('images/scene2/scene2-biggerfile-flip.png')";
     renderer.domElement.style.backgroundSize = "cover"; //make the image to fit the background size
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

  //define a plane geometry that will seat on top of the marker
	let geometry1 = new THREE.PlaneBufferGeometry(2,2, 1,1); 
  //draw a plan ontop of the marker(width, height, width segments, height segments)

  //add video as texture to the plane
	let video = document.getElementById( 'video' );
	let texture1 = new THREE.VideoTexture( video );
	texture1.minFilter = THREE.LinearFilter;
	texture1.magFilter = THREE.LinearFilter;
	texture1.format = THREE.RGBFormat;
	let material1 = new THREE.MeshBasicMaterial( { map: texture1 } );
	
	mesh1 = new THREE.Mesh( geometry1, material1 ); //apply plane and video to marker mesh
	mesh1.rotation.x = -Math.PI/2; //makes the maker surface to face the screen
	
	markerRoot.add( mesh1 );
  
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
