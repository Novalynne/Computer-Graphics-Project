import * as THREE from 'three';

export const light = new THREE.DirectionalLight(
    0xffffff,
    3
);

light.position.set(5, 15, 10);
light.castShadow = true;

// UPDATE BIAS TO CORRECT SHADOW ACNE
light.shadow.bias = -0.0005;

// SHADOW MAP SETTINGS
light.shadow.mapSize.set(4096, 4096);

light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;

light.shadow.camera.near = 0.5;
light.shadow.camera.far = 30;

// AMBIENT LIGHT
export const ambient = new THREE.AmbientLight(
    0xffffff,
    0.3
);

// HELPER
export const helper = new THREE.CameraHelper(light.shadow.camera);
helper.visible = false;