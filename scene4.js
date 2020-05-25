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
    renderer.setClearColor(new THREE.Color('white'), 0);//colour, transparancy
    renderer.setSize(myWidth, myHeight);
    renderer.domElement.style.backgroundImage = "url('images/scene2-background.jpg')";
    renderer.domElement.style.backgroundSize = "cover";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "35px";
    renderer.domElement.style.left = "50%";
    renderer.domElement.style.margin = '0 0 0 -480px'; //centres the screen
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
	markerRoot1 = new THREE.Group();
  markerRoot1.name = "marker1";
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "data/hiro.patt",
	})

// 	let geometry1 = new THREE.PlaneBufferGeometry(2,2, 1,1); 
//   //draw a plan ontop of the marker(width, height, width segments, height segments)

//   //add video as texture to the plane
// 	let video = document.getElementById( 'video' );
// 	let texture = new THREE.VideoTexture( video );
// 	texture.minFilter = THREE.LinearFilter;
// 	texture.magFilter = THREE.LinearFilter;
// 	texture.format = THREE.RGBFormat;
// 	let material1 = new THREE.MeshBasicMaterial( { map: texture } );
	
// 	mesh1 = new THREE.Mesh( geometry1, material1 );
// 	mesh1.rotation.x = -Math.PI/2;
	
// 	markerRoot1.add( mesh1 );
  
  //define a plane geometry that will seat on top of the marker
  let geometry = new THREE.PlaneGeometry(2, 2, 2);
	let loader = new THREE.TextureLoader();
  
    //Add all the images that the marker will display and use a mesh.visible = true/false; to control
  
    //adding the fisrt image - empty boat
	   let texture1 = loader.load( 'images/starfish.png', render ); 
	   let material1 = new THREE.MeshBasicMaterial( { map: texture1 } ); 
	
	   mesh1 = new THREE.Mesh( geometry, material1 );
	   mesh1.position.y = 1;
     mesh1.rotation.x = -Math.PI/2; //rotate so that if faces the screen
	
	   markerRoot1.add( mesh1 );
    
  //add second image - starfish on the boat
  	 let texture2 = loader.load( 'images/starfishOnBoat.png', render );
	   let material2 = new THREE.MeshBasicMaterial( { map: texture2 } );
	
	   mesh2 = new THREE.Mesh( geometry, material2 );
	   mesh2.position.y = 1;
     mesh2.rotation.x = -Math.PI/2;
  
     markerRoot1.add( mesh2 );
  
  mesh1.visible = false; //hide
  mesh2.visible = true; //visible
  
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
  position();
  
}

function position(){
  var starfish = document.getElementById("starfish");
  
  if (markerRoot1.position.x > 1.5){
    console.log("reached the island");
    console.log(markerRoot1.position);
    starfish.style.display = 'block'; //change css image to display
    
    mesh1.visible = true; //the emptyboat is visible
    mesh2.visible = false; //hide the starfishontheBoat image
    
  }
  
}

function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}
