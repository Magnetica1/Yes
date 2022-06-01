//setup
import "./style.css";
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
//value 1 = FOV, Value 2 = aspect ratio, Value 3 = view frustrum
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

//torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x4b5320});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);


//lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);

scene.add();

const controls = new OrbitControls(camera, renderer.domElement);

//animates Torus
function animate() {
  requestAnimationFrame(animate);
  
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.002;
  torus.rotation.z += 0.001;

  controls.update();

  renderer.render(scene, camera);
}

animate();

//makes stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

star.position.set(x, y, z);
scene.add(star);
}

Array(250).fill().forEach(addStar); 

//background
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

//mrG
const mrGTexture = new THREE.TextureLoader().load("./pf.jpg");

const mrG = new THREE.Mesh(
new THREE.BoxGeometry(6, 6, 6),
new THREE.MeshStandardMaterial({ map: mrGTexture })
);
mrG.position.set(30, 5, -15);
scene.add(mrG);

// Moon
const moonMap = new THREE.TextureLoader().load("normal.jpg");
const moonTexture = new THREE.TextureLoader().load("moon.jpg");

const moon = new THREE.Mesh(
new THREE.SphereGeometry(8, 37, 37),
new THREE.MeshStandardMaterial({ 
  map: moonTexture, 
  normalMap: moonMap,
})
);
scene.add(moon);

moon.position.z = 10;
moon.position.setX(-30);

//load Model
const loader = new GLTFLoader();

loader.load( "./Scale.glb", function ( gltf ) {

	scene.add( gltf.scene);
  gltf.scene.rotateY(80);
  gltf.scene.scale.set(5, 5, 5)
  gltf.scene.position.x = 20;
  gltf.scene.position.y = -20;
  
  function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;
  
    mrG.rotation.y += 0.1;
    mrG.rotation.z += 0.1;
  
    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.002;

    gltf.scene.rotateY(0.1);
  }
  
  document.body.onscroll = moveCamera;

}, undefined, function ( error ) {

	console.error( error );

} );

// scroll