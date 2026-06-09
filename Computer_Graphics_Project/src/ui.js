import GUI from 'lil-gui';

// GET LIGHT, STATE
import { state } from './main.js';
import { light, helper } from './lights.js';

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

    // TOGGLE SHADOW MAP
    gui.add(state, 'showShadowMap')
        .name('Show Shadow Map');
}

// UPDATE SHADOW CAMERA PROJECTION MATRIX AND HELPER
function updateShadowCamera() {
    light.shadow.camera.updateProjectionMatrix();
    helper.update();
}