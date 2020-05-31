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
    renderer.domElement.style.background = "url('images/scene4/scene 4 background.gif')";
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
	   let texture1 = loader.load( 'images/scene4/scene4Boat.png', render ); 
	   let material1 = new THREE.MeshBasicMaterial( { map: texture1 } ); 
	
	   mesh1 = new THREE.Mesh( geometry, material1 );
	   mesh1.position.y = 1;
     mesh1.rotation.x = -Math.PI/2; //rotate so that if faces the screen
	
	   markerRoot.add( mesh1 );
    
  //add second image - starfish on the boat
  	 let texture2 = loader.load( 'images/scene4/scene4-hiro on boat.png', render );
	   let material2 = new THREE.MeshBasicMaterial( { map: texture2 } );
	
	   mesh2 = new THREE.Mesh( geometry, material2 );
	   mesh2.position.y = 1;
     mesh2.rotation.x = -Math.PI/2;
  
     markerRoot.add( mesh2 );
  
  mesh1.visible = true; //display
  mesh2.visible = false; //hide
  
}

//picks up a material when the marker is in the position of the material
function pickupAndDropoff() 
{
   //load starfish image 
   let starfishImage = document.getElementById( 'starfish' );
  
   //pick up a piece
   if (markerRoot.position.x > -1.5 && markerRoot.position.x < -0.7 && markerRoot.position.y > 1.2 && markerRoot.position.y < 1.5){
      console.log('Pick up Hiro');
      mesh1.visible = false;
      mesh2.visible = true;
      starfishImage.style.display = "none";
   }
   
   //drop off a piece
   if (mesh2.visible == true && markerRoot.position.x > 2.7 && markerRoot.position.x < 3 && markerRoot.position.y > -2 && markerRoot.position.y < -1.5){ 
      //^above code^ checks if the pickupflag img in the background has been disappeared
      console.log('HIDE');
      mesh1.visible = true;
      mesh2.visible = false;
      let starfishMoved = document.getElementById( 'starfishMoved' );
      starfishMoved.style.display = "block";
      starfishMoved.style.animation= "sink 5s";  //sink animation for 5sec (the sink animation code is in css file)
      starfishMoved.style.webkitAnimationFillMode= "forwards"; //leaves the animation at 100% status
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

typewriter.typeString('Yeay! we are almost there ')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('Now, show your <strong>key</strong> to the webcam to launch the boat⛵ we just built!')
    .pauseFor(1500)
    .deleteAll(1)
    .typeString('Then, sail the boat to pick Hiro up from the <strong>island 🏝️</strong>')
    .pauseFor(1500)
    .deleteAll(1)
    .typeString('and when Hiro is on the boat, ')
    .pauseFor(500)
    .typeString('drop hiro off at the <strong>✖️ point</strong>')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('That is where Hiro lives 🏠')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('Ready?')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('lets take Hiro home 🌊')
    .start();