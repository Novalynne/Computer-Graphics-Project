import * as THREE from 'three';

// SCENE
export const scene = new THREE.Scene();
export const shadowMapPreviewScene = new THREE.Scene();

// CAMERA
export const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

export const shadowMapPreviewCamera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    0.1,
    10
);
shadowMapPreviewCamera.lookAt(0, 0, 0);
shadowMapPreviewCamera.position.z = 1;

// RENDERER
export const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);