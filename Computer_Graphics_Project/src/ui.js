import GUI from 'lil-gui';
import * as THREE from "three";

// GET LIGHTS, STATE, HELPER, RENDERER
import {state} from './state.js';
import {light, helper, pointLightHelper, pointLight} from './lights.js';
import {renderer} from "./scene.js";

export function createUI() {

    const gui = new GUI({ width: 300 });

    // ROOT FOLDER
    const lightsFolder = gui.addFolder('Lights');
    lightsFolder.$title.style.color = '#31e1db';

    // ==================================================
    // DIRECTIONAL LIGHT
    // ==================================================

    const directionalFolder = lightsFolder.addFolder('Directional Light');
    directionalFolder.$title.style.color = '#4fc3f7';

    directionalFolder.add(state, 'showDirectionalLight')
        .name('Enabled')
        .onChange(v => {
            light.visible = v;
        });

    directionalFolder.add(state, 'showShadow')
        .name('Shadows')
        .onChange(v => {
            light.castShadow = v;
        });

    directionalFolder.add(state, 'showHelper')
        .name('Directional Light Helper')
        .onChange(v => {
            helper.visible = v;
        });

    directionalFolder.add(state, 'bias', -0.001, 0.0002, 0.000001)
        .name('Bias')
        .onChange(v => {
            light.shadow.bias = v;
        });

    const directionalPosition = directionalFolder.addFolder('Position');

    directionalPosition.add(light.position, 'x', -20, 20)
        .onChange(updateShadowCamera);

    directionalPosition.add(light.position, 'y', 0, 15)
        .onChange(updateShadowCamera);

    directionalPosition.add(light.position, 'z', -20, 20)
        .onChange(updateShadowCamera);

    // ==================================================
    // POINT LIGHT
    // ==================================================

    const pointFolder = lightsFolder.addFolder('Point Light');
    pointFolder.$title.style.color = '#4fc3f7';

    pointFolder.add(state, 'showPointLight')
        .name('Enabled')
        .onChange(v => {
            pointLight.visible = v;
        });

    pointFolder.add(state, 'showPointLightShadow')
        .name('Shadows')
        .onChange(v => {
            pointLight.castShadow = v;
        });

    pointFolder.add(state, 'showPointLightHelper')
        .name('Point Light Helper')
        .onChange(v => {
            pointLightHelper.visible = v;
        });

    pointFolder.add(state, 'pointLightBias', -0.001, 0.0002, 0.000001)
        .name('Bias')
        .onChange(v => {
            pointLight.shadow.bias = v;
        });

    const pointPosition = pointFolder.addFolder('Position');

    pointPosition.add(pointLight.position, 'x', -20, 20)
        .onChange(updatePointLightShadowCamera);

    pointPosition.add(pointLight.position, 'y', 0, 15)
        .onChange(updatePointLightShadowCamera);

    pointPosition.add(pointLight.position, 'z', -20, 20)
        .onChange(updatePointLightShadowCamera);

    // ==================================================
    // SHADOW SETTINGS
    // ==================================================

    const shadowFolder = gui.addFolder('Shadow Settings');
    shadowFolder.$title.style.color = '#ff8a65';

    shadowFolder.add(state, 'shadowRadius', 1, 10)
        .name('Shadow Radius')
        .onChange(v => {
            light.shadow.radius = v;
            pointLight.shadow.radius = v;
        });

    const shadowTypes = {
        Basic: THREE.BasicShadowMap,
        PCF: THREE.PCFShadowMap,
        VSM: THREE.VSMShadowMap
    }

    shadowFolder.add(state, 'shadowType', shadowTypes)
        .name('Shadow Type')
        .onChange(value => {
            renderer.shadowMap.type = value;
        });

    const note = document.createElement('div');
    note.style.padding = '8px';
    note.style.fontSize = '11px';
    note.style.opacity = '0.8';
    note.innerHTML = '⚠️ VSM shadow map not supported for PointLights';
    shadowFolder.domElement.appendChild(note);

    shadowFolder.add(state, 'showShadowMap')
        .name('Deph Shadow Map')
        .onChange(v => {
            document.getElementById('shadowMapView')
                .style.visibility = v ? 'visible' : 'hidden';
        });
}

// UPDATE SHADOW CAMERA MATRIX AND HELPER
function updateShadowCamera() {
    light.shadow.camera.updateMatrix();
    helper.update();
}

// UPDATE POINT LIGHT SHADOW CAMERA MATRIX
function updatePointLightShadowCamera() {
    pointLight.shadow.camera.updateMatrix();
    pointLightHelper.update();
}


