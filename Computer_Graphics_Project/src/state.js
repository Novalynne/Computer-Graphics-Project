import * as THREE from "three";

export const state = {
    bias: -0.0005,
    pointLightBias: -0.01,

    showShadowMap: false,

    cubeMaterial: 'Standard',

    showDirectionalLight: true,
    showPointLight: false,

    showHelper: false,
    showPointLightHelper: false,

    showShadow: true,
    showPointLightShadow: true,

    shadowType: THREE.PCFShadowMap
};

export const shadowState = {
    intensity: 1.0,
    tint: new THREE.Color(0x000000)
};