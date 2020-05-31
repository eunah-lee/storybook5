//drawing-p5.js

let sand;
let starfish;
let gif_loadImg;

//preload starfish image and ocean gif
function preload(){
  starfish = loadImage('images/starfish.png');
  gif_loadImg = loadImage("images/scene1/scene1-sea.gif");
}

//load sand image as background
function setup() {
  sand = loadImage("images/scene1/scene1-biggerfile.png");
  var canvas = createCanvas(960, 540);
  canvas.position(240, 35); //make the position of the sketch the same with other
  
}

//apply sand as background and add starfish and gif ocean
function draw() {
  background(sand);
  image(starfish, 100, 180, 300, 300);
  image(gif_loadImg, 20, 20);
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

typewriter.typeString('Hello there 👋 ') //inefficient but a way to change font-><span style = "font-family: Arial, Helvetica, sans-serif"> Hello there 👋 </span>
    .pauseFor(1000) //1000 millisecond = 1sec
    //.typeString('<br/>') //next sentance
    .typeString('Im Hiro, a starfish.')
    .pauseFor(1000)
    .deleteAll(1) //deleting speed(lower=>faster)
    .typeString('I was chillin on a coral in my backyard...')
    .pauseFor(500)
    //.typeString('<br/>')
    .typeString(' and a wave flew me here.')
    .pauseFor(1000)
    .deleteAll(1)
    .typeString('Could you help me to find my way back home?')
    .start();