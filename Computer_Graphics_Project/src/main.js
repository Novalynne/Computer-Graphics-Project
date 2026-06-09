import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const state = {
    bias: -0.0005,
    showShadowMap: false,
    showHelper: false,
    showShadow: true,
};

import {scene, camera, renderer} from './scene.js';
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

// SHADOW MAP DEBUG VIEW PLANE
const debugPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({ map: null })
);

debugPlane.position.set(5, -5, 0);
debugPlane.scale.set(1, 1, 1);
scene.add(debugPlane);

// IF SHADOW MAP IS VISIBLE, UPDATE THE SHADOW MAP DEBUG VIEW
function updateShadowMap() {

    if (light.shadow.map) {
        debugPlane.material.map = light.shadow.map.texture;
        debugPlane.material.needsUpdate = false;
    }
}

// ANIMATE CUBE LOOP
function animateCube() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

// RENDERING LOOP
function renderScene() {

    requestAnimationFrame(renderScene);

    animateCube();
    controls.update();


    updateShadowMap();
    debugPlane.visible = state.showShadowMap;

    renderer.render(scene, camera);
}

renderScene();
