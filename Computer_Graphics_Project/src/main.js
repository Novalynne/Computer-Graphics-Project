import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { state } from './state.js';
import {scene, camera, renderer} from './scene.js';
import {shadowMapPreviewCamera, shadowMapPreviewScene} from "./scene.js";
import {light, ambient, pointLight, helper, pointLightHelper} from './lights.js';
import { createUI } from './ui.js';
import {loadCube, loadModel} from "./models.js";
import Stats from "./stats.js";
import {shadowMap, lightCamera, depthMaterial, updateLightMatrix, lightMatrix} from "./shaders.js";

// ADD LIGHT AND HELPER TO SCENE
scene.add(light);
scene.add(pointLight);
scene.add(ambient);
scene.add(helper);
scene.add(pointLightHelper);

// LOAD MODEL AND CUBE
loadModel(scene);
export const cube = loadCube(scene);

// UI
createUI();

// TIMER AND STATS UI
let timer, stats;
timer = new THREE.Timer();
timer.connect( document );
stats = new Stats();
document.body.appendChild(stats.dom);

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

function updateShadowMap() {

    let texture;

    if (light.shadow.map && light.shadow) {
        texture = light.shadow.map.texture;
        debugPlane.material.map = texture;
    }
}

// ANIMATE CUBE LOOP
function animateCube() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

// FUNCTION WHERE THE 1° RENDER FROM THE POINT OF VIEW OF LIGHT IS DONE,
// THE MATERIAL OF THE SCENE ARE UPDATED TO A DEDICATED SHADER MATERIAL THEN THE SCENE IS RENDERED FROM THE LIGHT CAMERA
function renderShadowMap() {

    renderer.setRenderTarget(shadowMap);
    renderer.clear();

    scene.overrideMaterial = depthMaterial;

    renderer.render(scene, lightCamera);

    scene.overrideMaterial = null;
    renderer.setRenderTarget(null);

}

// RENDERING LOOP
renderer.autoClear = false;

function renderScene() {

    requestAnimationFrame(renderScene);

    stats.update();

    animateCube();
    controls.update();

    // UPDATES OF LIGHT MATRIX AND SHADER UNIFORMS
    updateShadowMap();
    updateLightMatrix();
    scene.traverse((obj) => {
        if (obj.isMesh && obj.userData._shadowShader) {

            obj.userData._shadowShader.uniforms.usePCF.value = state.usePCF;
            obj.userData._shadowShader.uniforms.useVSM.value = state.useVSM;
            obj.userData._shadowShader.uniforms.bias.value = state.bias;
            obj.userData._shadowShader.uniforms.lightMatrix.value.copy(lightMatrix);
        }
    });

    // 1° PASS: SHADOW MAP
    renderShadowMap();

    renderer.clear();

    // 2° PASS: MAIN SCENE
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
