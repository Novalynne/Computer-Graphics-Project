import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const state = {
    bias: -0.0005,
    showShadowMap: false,
    showHelper: false,
    showShadow: true,
    shadowType: 2 // 0: Basic, 1: PCF, 2: PCFSoft, 3: VSM
};

import {scene, camera, renderer} from './scene.js';
import {shadowMapPreviewCamera, shadowMapPreviewScene} from "./scene.js";
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
debugPlane.position.set(0, -0.20, 0);
debugPlane.scale.set(0.9,0.9,0.9);
shadowMapPreviewScene.add(debugPlane);

// IF SHADOW MAP IS VISIBLE, UPDATE THE SHADOW MAP DEBUG VIEW
function updateShadowMap() {

    if (light.shadow.map && light.shadow) {
        debugPlane.material.map = light.shadow.map.texture;
    }
}

// ANIMATE CUBE LOOP
function animateCube() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

// RENDERING LOOP
renderer.autoClear = false;

function renderScene() {

    requestAnimationFrame(renderScene);

    animateCube();
    controls.update();

    updateShadowMap();

    renderer.clear();

    // MAIN SCENE
    renderer.render(scene, camera);

    // SHADOW MAP SCENE
    if (state.showShadowMap) {

        renderer.clearDepth();

        renderer.setViewport(10, 10, 400, 400);
        renderer.setScissor(10, 10, 400, 400);
        renderer.setScissorTest(true);

        renderer.render(shadowMapPreviewScene, shadowMapPreviewCamera);

        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    }
}

renderScene();
