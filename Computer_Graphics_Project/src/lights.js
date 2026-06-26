import * as THREE from 'three';
import {state} from "./state.js";

// DIRECTIONAL LIGHT
export const light = new THREE.DirectionalLight(
    0xffffff,
    3
);

light.position.set(5, 15, 10);
light.castShadow = true;

// UPDATE BIAS TO CORRECT SHADOW ACNE
light.shadow.bias = -0.0005;

// DIRECTIONAL LIGHT SHADOW MAP SETTINGS
light.shadow.mapSize.set(4096, 4096);

light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;

light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;
light.shadow.radius = 2.5;

// AMBIENT LIGHT
export const ambient = new THREE.AmbientLight(
    0xffffff,
    0.3
);

// POINT LIGHT
export const pointLight = new THREE.PointLight(
    0xffffff,
    3
);

pointLight.position.set(0, 1, 0);
pointLight.castShadow = true;
pointLight.visible = false;

// UPDATE BIAS TO CORRECT SHADOW ACNE
pointLight.shadow.bias = -0.01;

// POINT LIGHT SHADOW MAP SETTINGS
pointLight.shadow.mapSize.set(1024, 1024);
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 50;
pointLight.shadow.radius = 2.5

// HELPER
export const helper = new THREE.CameraHelper(light.shadow.camera);
helper.visible = false;

export const pointLightHelper = new THREE.PointLightHelper(pointLight);
pointLightHelper.visible = false;