//0.132.2
import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { EffectComposer } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/UnrealBloomPass.js";


//HTML Div Element
let renderView = document.getElementById("renderView");

//Main Variables
let camera, scene, renderer, composer;
let bloomPass;
let cube;

//Utility
let clock = new THREE.Clock();
let mouse = new THREE.Vector2(1, 1);
const animationSpeed = 0.5;

var animate = function () { 
    requestAnimationFrame( animate ); 

    let deltaTime = clock.getDelta();
    let elapsedTime = clock.getElapsedTime();

    //cube rotation
    cube.rotation.x += 1 * deltaTime * animationSpeed;
    cube.rotation.y += 2 * deltaTime * animationSpeed;

    //cube scale
    let scale = Math.sin(elapsedTime*animationSpeed)/2 + 0.5 + 1;
    cube.scale.set(scale, scale, scale);

    //cube color
    let b = Math.sin(elapsedTime*animationSpeed)/2 + 0.5;
    cube.material.color = new THREE.Color(b,b/2,1-b);

    composer.render();
}


function init() {
  //MAIN SETUP
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( renderView.clientWidth, renderView.clientHeight);
  renderView.appendChild( renderer.domElement );

  composer = new EffectComposer( renderer );
  composer.setSize( renderView.clientWidth, renderView.clientHeight);

  //POST PROCESSING
  let renderPass = new RenderPass( scene, camera );
  bloomPass = new UnrealBloomPass( new THREE.Vector2(renderView.innerWidth, renderView.innerHeight), 1.5, 0.4, 0.85 );

  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  

  //EVENT LISTENERS
  document.addEventListener('mousemove', mouseMoved, false);
  document.addEventListener('click', mouseClicked, false);

  //CAMERA
  camera.position.z = 5;
  
  //ADD OBJECTS
  //CUBE
  let cubeMaterial = new THREE.MeshPhysicalMaterial();
  cubeMaterial.reflectivity = 0.8;
  cubeMaterial.roughness = 0.2;
  let cubeGeometry = new THREE.BoxGeometry( 1, 1, 1.5 );
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);
  
  //LIGHT
  let light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.decay = 2;
  light.position.set(1, 1, 2);
  light.intensity = 3;
  scene.add( light );

  //LIGHT 2
  let lightTwo = new THREE.PointLight( 0xffffff, 1, 100 );
  lightTwo.decay = 2;
  lightTwo.position.set( -1, 1, -2 );
  lightTwo.intensity = 5;
  scene.add( lightTwo );

  //ambient light
  let lightThree = new THREE.AmbientLight(0x404040);
  //lightThree.position.set( -1, 1, -2 );
  lightThree.decay = 2;
  lightThree.intensity = 0.5;
  scene.add( lightThree );



  //START RENDERING
  animate();
}

//Event Responders
function mouseClicked(event) {
  console.log("mouse click");
}
function mouseMoved(event) {
  //-1 to 1
  // mouse.x = ((event.clientX / renderView.clientWidth) - 0.5) * 2;
  // mouse.y = ((event.clientY / renderView.clientHeight) - 0.5) * 2;

  //0 to 1
  mouse.x = (event.clientX / renderView.clientWidth);
  mouse.y = (event.clientY / renderView.clientHeight);
}

init();