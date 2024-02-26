import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer;
let texLoader = new THREE.TextureLoader();
let imagePlanes = []; 
let radius = 10; 
let angleStep; 

function init() {
  scene = new THREE.Scene();

  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 30; // Adjust so we can see the circle
  camera.position.y = 0;
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);

  let controls = new OrbitControls(camera, renderer.domElement);

  // Fetch and display images from API, then position them in a circle
  getDataAndDisplay("brooklyn");

  loop();
}

function loop() {
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

class MyImageDisplay {
  constructor(url, index, total) {
    let imageTexture = texLoader.load(url);
    let geo = new THREE.PlaneGeometry(1, 1);
    let mat = new THREE.MeshBasicMaterial({ map: imageTexture, side: THREE.DoubleSide });
    let mesh = new THREE.Mesh(geo, mat);
    this.mesh = mesh;
    scene.add(mesh);

    // Calculate position in circle
    let angle = index / total * Math.PI * 2;
    mesh.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );

    // Rotate plane to face towards the center of the circle
    mesh.lookAt(0, 0, 0);
  }
}

function getDataAndDisplay(query) {
  let url = `https://api.artic.edu/api/v1/artworks/search?q=${query}&query[term][is_public_domain]=true`;
  fetch(url)
    .then(res => res.json())
    .then(json => {
      let data = json.data;
      angleStep = Math.PI * 2 / data.length; // Calculate angle step for each image
      for (let i = 0; i < data.length; i++) {
        let itemInfoUrl = data[i].api_link;
        fetch(itemInfoUrl)
          .then(res => res.json())
          .then(json => {
            let image_id = json.data.image_id;
            let imageUrl = `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`;
            imagePlanes.push(new MyImageDisplay(imageUrl, i, data.length));
          });
      }
    });
}

init();
