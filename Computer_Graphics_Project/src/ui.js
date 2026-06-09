import GUI from 'lil-gui';
import * as THREE from "three";

// GET LIGHT, STATE
import { state } from './main.js';
import { light, helper } from './lights.js';
import {renderer} from "./scene.js";


export function createUI() {

    const gui = new GUI({ width: 300 });

    // BIAS SLIDER
    gui.add(state, 'bias', -0.001, 0.0002, 0.000001)
        .name('Shadow Bias')
        .onChange((v) => {
            light.shadow.bias = v;
        });

    // LIGHT POSITION DEBUG
    const lightFolder = gui.addFolder('Light Position');

    lightFolder.add(light.position, 'x', -20, 20)
        .onChange(updateShadowCamera);

    lightFolder.add(light.position, 'y', 0, 15)
        .onChange(updateShadowCamera);

    lightFolder.add(light.position, 'z', -20, 20)
        .onChange(updateShadowCamera);

    // TOGGLE SHADOW HELPER
    gui.add(state, 'showHelper')
        .name('Show Shadow Helper')
        .onChange((v) => {
            helper.visible = v;
        });

    // TOGGLE SHADOW
    gui.add(state, 'showShadow')
        .name('Show Shadows')
        .onChange((v) => {
            light.castShadow = v;
        });

    // SHADOW MAP TYPE
    gui.add(state, 'shadowType', shadowTypes)
        .onChange(value => {
            renderer.shadowMap.type = value;
        });

    // TOGGLE SHADOW MAP
    gui.add(state, 'showShadowMap')
        .name('Show Shadow Map')
        .onChange((v) => {
            state.showShadowMap = v;
            if(v){
                document.getElementById('shadowMapView').style.visibility = 'visible';
            }else{
                document.getElementById('shadowMapView').style.visibility = 'hidden';
            }
        });
}

// UPDATE SHADOW CAMERA PROJECTION MATRIX AND HELPER
function updateShadowCamera() {
    light.shadow.camera.updateMatrix();
    helper.update();
}

// CHANGE SHADOW MAP TYPE
const shadowTypes = {
    Basic: THREE.BasicShadowMap,
    PCF: THREE.PCFShadowMap,
    PCFSoft: THREE.PCFSoftShadowMap,
    VSM: THREE.VSMShadowMap
}