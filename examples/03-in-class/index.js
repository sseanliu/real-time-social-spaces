/*
This example uses a function named "loop" to tell the renderer to render. This function will call
the  'window.requestAnimationFrame()' function to tell the browser window to continue drawing 
at 60 frames per second.  

RequestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame


*/
import * as THREE from "three";
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

// create a scene in which all other objects will exist
let scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505);

// create a camera and position it in space
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, 3, 5);

// the renderer will actually show the camera view within our <canvas>
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// create a sphere
let geometry = new THREE.SphereGeometry(1, 12, 12);
let material = new THREE.MeshPhongMaterial({ color: "white" });
let body = new THREE.Mesh(geometry, material);
let wingR = new THREE.Mesh(geometry, material);
let wingL = new THREE.Mesh(geometry, material);

body.position.set(0, 0.5, 0);
body.scale.set(0.3, 0.3, 0.3);
body.castShadow = true;

wingR.position.set(0.8, 0.5, 0);
wingR.scale.set(0.7, 0.3, 0.7);
wingR.castShadow = true;

wingL.position.set(-0.8, 0.5, 0);
wingL.scale.set(0.7, 0.3, 0.7);
wingL.castShadow = true;

let bird = new THREE.Group();
let wingLG = new THREE.Group();
let wingRG = new THREE.Group();

// and add it to the scene
wingLG.add(wingL);
wingRG.add(wingR);

scene.add(body);
scene.add(wingRG);
scene.add(wingLG);

function addLighting() {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  mesh.position.set(0, 0, -1);
  //scene.add(mesh);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = - 2;
  dirLight.shadow.camera.left = - 2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add(dirLight);
}
addLighting();

function addBackground() {
  //let bg = new THREE.TextureLoader().load('./hayloft.png');
  // bg.wrapS = THREE.RepeatWrapping;
  // bg.wrapT = THREE.RepeatWrapping;
  //bg.repeat.set = (20,10);
  //scene.background = bg;

  new EXRLoader().load( 'hayloft_4k.exr', function ( texture ) {

    // texture.mapping = THREE.EquirectangularReflectionMapping;

    // exrCubeRenderTarget = pmremGenerator.fromEquirectangular( texture );
    // exrBackground = texture;

    console.log(texture);
    scene.background = texture;

  } );

}
addBackground();

let clock = new THREE.Clock(); 

function draw() {
  let time = clock.getElapsedTime();
  let sinWave = Math.sin(time * 5); 

  wingLG.rotation.z = sinWave * 0.3; 
  wingRG.rotation.z = -sinWave * 0.3; 

  renderer.render(scene, camera);
  window.requestAnimationFrame(draw);
}
draw();
