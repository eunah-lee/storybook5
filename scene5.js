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
	// Initialize a basic camera
  // Create a camera
	camera = new THREE.Camera();
  
	scene.add(camera);
  
  let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
  
  //init renderer
	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
  
    // style of ar layer
    renderer.setClearColor(new THREE.Color('white'), 0);//colour, transparancy  //display the background as transparant to use the video beneath in html
    renderer.setSize(myWidth, myHeight);
    //add jpeg background image and ocean gif as a background //first one goes on top
    renderer.domElement.style.background = "url('https://cdn.glitch.com/31d57af0-1015-435b-9a6a-d40fcb04fe9e%2Fscene5-background.gif?v=1590959610669')";
    renderer.domElement.style.backgroundSize = "cover"; 
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "35px";
    renderer.domElement.style.left = "50%";
    //renderer.domElement.style.opacity = "0.2";
    renderer.domElement.style.margin = '0 0 0 -480px'; //centres the screen
    //renderer.domElement.style.zIndex = "4";//brings the renderer forward sothat it sits on top of the video background
    renderer.domElement.style.transform = "scaleX(-1)"; //flip the renderer Y axis(so that the user's motion is mirrored)
    //renderer.domElement.style.border = "2px, red";
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

	// function onResize()
	// {
	// 	arToolkitSource.onResize()	
	// 	arToolkitSource.copySizeTo(renderer.domElement)	
	// 	if ( arToolkitContext.arController !== null )
	// 	{
	// 		arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
	// 	}	
	// }

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
  let geometry = new THREE.PlaneGeometry(1, 1.2, 1, 1);
	let loader = new THREE.TextureLoader();
  
    //Add all the images that the marker will display and use a mesh.visible = true/false; to control
  
    //adding the fisrt image - empty boat
	   let texture1 = loader.load( 'images/starfish.png', render ); 
	   let material1 = new THREE.MeshBasicMaterial( { map: texture1 } ); 
	
	   mesh1 = new THREE.Mesh( geometry, material1 );
	   mesh1.position.y = 1;
     mesh1.rotation.x = -Math.PI/2; //rotate so that if faces the screen
	
	   markerRoot.add( mesh1 );
  
     mesh1.visible = true; //display
  
}

//picks up a material when the marker is in the position of the material
function pickupAndDropoff() 
{
   //load starfish image 
   let starfishImage = document.getElementById( 'starfish' );
   let endingImage = document.getElementById( 'ending' );
   
   //if marker is in position place Hiro
   if ( markerRoot.position.x > -0.5 && markerRoot.position.x < 0.5 && markerRoot.position.y > -2 && markerRoot.position.y < -1.5){ 
      //^above code^ checks if the pickupflag img in the background has been disappeared
      console.log('HIDE');
      mesh1.visible = false;
      starfishImage.style.display = "block";
      endingImage.style.display = "block";
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

typewriter.typeString('Now we are underwater too!')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('This empty space must be where hiro was chilling👆  right before Hiro got lost!')
    .pauseFor(1500)
    .deleteAll(1)
    .typeString('That means we are here! YEAY')
    .pauseFor(1500)
    .deleteAll(1)
    .typeString('As a last mission, use you key to place Hiro at home')
    .pauseFor(500)
    .typeString(' so that Hiro can continue to chill.')
    .pauseFor(1500)
    .deleteAll(1)
    .typeString('Ready? Lets do this!')
    .pauseFor(3000)
    .deleteAll(1)
    .start();