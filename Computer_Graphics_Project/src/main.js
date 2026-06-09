import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const state = {
    bias: -0.0005,
    showShadowMap: false,
    showHelper: false,
    showShadow: true,
};

import { scene, camera, renderer } from './scene.js';
import {light, ambient, helper} from './lights.js';
import { createUI } from './ui.js';
import {loadCube, loadModel} from "./models.js";

// ADD LIGHT AND HELPER TO SCENE
scene.add(light);
scene.add(ambient);
scene.add(helper);

// LOAD MODEL AND CUBE
loadModel(scene);
const cube = loadCube(scene);

// UI
createUI();

// RESIZE WINDOW
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});

// CAMERA CONTROLS
const controls = new OrbitControls(
    camera,
    renderer.domElement
);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.update();

// CUBE ANIMATION LOOP
function animate() {

    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
}

animate();