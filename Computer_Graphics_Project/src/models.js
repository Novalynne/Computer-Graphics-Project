import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// FUNCTION TO LOAD THE MODEL
export function loadModel(scene) {

    const loader = new GLTFLoader();

    loader.load('/models/isometric_room/scene.gltf', (gltf) => {

        const model = gltf.scene;

        model.traverse((child) => {

            if (child.isMesh) {

                // add shadows to all meshes
                child.castShadow = true;
                child.receiveShadow = true;

                // remove red plane from scene
                const box = new THREE.Box3().setFromObject(child);
                const size = new THREE.Vector3();
                box.getSize(size);

                if (size.x > 10 && size.z > 10 && size.y < 1) {
                    child.visible = false;
                }
            }
        });

        scene.add(model);

    });

}

// FUNCTION TO LOAD THE CUBE
export function loadCube(scene) {

    const geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    const cube = new THREE.Mesh(
        geometry,
        material
    );

    cube.position.y = 1;
    cube.castShadow = true;
    scene.add(cube);

    return cube;
}

// SHADER MATERIAL TO SIMULATE GLASS DEPTH IN SHADOW MAP
export const glassDepthMaterial = new THREE.ShaderMaterial({
    vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uOpacity;

    void main() {
      // invece di bloccare tutta la luce:
      gl_FragColor = vec4(0.3, 0.3, 0.3, 1.0);
    }
  `
});

export const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00ff00,
    transmission: 1,
    roughness: 0,
    thickness: 0.5,
    ior: 1.5,
});

