import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

// CARICAMENTO MODELLO 3D
const loader = new GLTFLoader();
loader.load(
    'models/isometric_room/scene.gltf',
    (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {

                // ABILITO LE OMBRE
                child.castShadow = true;
                child.receiveShadow = true;

                // RIMUOVO IL PIANO ROSSO BASANDOMI SULLE DIMENSIONI DEL BOUNDING BOX
                const box = new THREE.Box3().setFromObject(child);
                const size = new THREE.Vector3();
                box.getSize(size);

                const isFloor =
                    size.x > 10 &&     // molto largo
                    size.z > 10 &&     // molto largo
                    size.y < 1;        // molto piatto

                if (isFloor) {
                    child.visible = false;
                    console.log("FLOOR RIMOSSO:", child.name);
                }
            }
        });
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        scene.add(model);
    },
    undefined,
    (error) => {
        console.error('Errore nel caricamento del modello:', error);
    }
);

// CUBO
const geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const cube = new THREE.Mesh(
    geometry,
    material
);

cube.position.y = 1;
cube.castShadow = true;
scene.add(cube);

// ANIMAZIONE
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();

    renderer.render(scene, camera);
}

animate();
