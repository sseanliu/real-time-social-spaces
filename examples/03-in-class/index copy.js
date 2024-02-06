/*
This example uses a function named "loop" to tell the renderer to render. This function will call
the  'window.requestAnimationFrame()' function to tell the browser window to continue drawing 
at 60 frames per second.  

RequestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame


*/
import * as THREE from "three";

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
let torso = new THREE.Mesh(geometry, material);
let head = new THREE.Mesh(geometry, material);

body.position.set(0, 0.5, 0);
body.castShadow = true;

torso.position.set(0, 1.75, 0);
torso.scale.set(0.7, 0.7, 0.7);
torso.castShadow = true;

head.position.set(0, 2.65, 0);
head.scale.set(0.4, 0.4, 0.4);
head.castShadow = true;

let bird = new THREE.Group();

// and add it to the scene
bird.add(body);
bird.add(torso);
bird.add(head);

scene.add(bird);

function addLighting() {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  mesh.position.set(0, 0, -1);
  scene.add(mesh);

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


function draw() {
  // add some movement
  bird.rotateZ(0.01);

  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(draw); // pass the name of your loop function into this function
}
draw();
