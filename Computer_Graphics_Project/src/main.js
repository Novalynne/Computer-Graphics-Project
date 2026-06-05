import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// SCENA
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.domElement.style.display = "block";
document.body.appendChild(renderer.domElement);

// GESTIONE RIDIMENSIONAMENTO FINESTRA
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

// LUCE
const light = new THREE.DirectionalLight(
    0xffffff,
    3
);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);

// CONFIGURAZIONE OMBRE
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 30;

// LUCE AMBIENTE
const ambient = new THREE.AmbientLight(
    0xffffff,
    0.3
);
scene.add(ambient);

// HELPER
const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

// CONTROLLI TELECAMERA
const controls = new OrbitControls(
    camera,
    renderer.domElement
);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.update();

// CUBO
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const cube = new THREE.Mesh(
    geometry,
    material
);

cube.position.y = 1;
cube.castShadow = true;
scene.add(cube);

// PIANO
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });

const plane = new THREE.Mesh(
    planeGeometry,
    planeMaterial
);

plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// ANIMAZIONE
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();

    renderer.render(scene, camera);
}

animate();
