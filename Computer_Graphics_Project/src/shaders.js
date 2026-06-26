import * as THREE from "three";
import { scene } from "./scene.js";
import { light } from "./lights.js";
import {state} from "./state.js";

export const SHADOW_SIZE = 4096;

// 1. RENDER TARGET
export const shadowMap = new THREE.WebGLRenderTarget(SHADOW_SIZE, SHADOW_SIZE);

shadowMap.depthTexture = new THREE.DepthTexture(SHADOW_SIZE, SHADOW_SIZE);
shadowMap.depthTexture.type = THREE.UnsignedIntType;
shadowMap.depthBuffer = true;

// 2. LIGHT CAMERA
export const lightCamera = new THREE.OrthographicCamera(
    -10, 10,
    10, -10,
    0.1, 50
);

lightCamera.position.copy(light.position); //the camera has the same position as the light
lightCamera.lookAt(0, 0, 0);

export const lightMatrix = new THREE.Matrix4();
export function updateLightMatrix(){

    lightCamera.position.copy(light.position);

    lightCamera.lookAt(0,0,0);

    lightCamera.updateMatrixWorld();
    lightCamera.updateProjectionMatrix();

    lightMatrix.multiplyMatrices(
        lightCamera.projectionMatrix,
        lightCamera.matrixWorldInverse
    );
}

// 3. DEPH SHADER MATERIAL, USES THE VERTEX E FRAGMENT SHADERS FROM THE 1° RENDERING
export const depthMaterial = new THREE.ShaderMaterial({

    uniforms: {
        lightMatrix: { value: lightMatrix },
        useVSM: { value: state.useVSM }
    },

    vertexShader: `
        uniform mat4 lightMatrix;

        void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            gl_Position = lightMatrix * worldPos;
        }
    `,

    fragmentShader: `
        #ifdef GL_ES
        precision highp float;
        #endif

        uniform bool useVSM;

        void main() {

            if (!useVSM) {
                // BASIC / PCF mode → only depth
                return;
            }

            // VSM: encode moments
            float depth = gl_FragCoord.z;

            float dx = dFdx(depth);
            float dy = dFdy(depth);
            float moment2 = depth * depth + 0.25 * (dx*dx + dy*dy);

            gl_FragColor = vec4(depth, moment2, 0.0, 1.0);
        }
    `
});

// FUNCTION TO OVERWRITE THE FRAGMENT SHADER OF THE MATERIAL OF THE SCENE OBJECTS
export function applyShadowShader(mesh) {

    mesh.material.onBeforeCompile = (shader) => {

        // =========================
        // UNIFORMS
        // =========================
        shader.uniforms.shadowMapCustom = { value: shadowMap.texture };
        shader.uniforms.lightMatrix = { value: lightMatrix };
        shader.uniforms.bias = { value: state.bias };
        shader.uniforms.usePCF = { value: state.usePCF };
        shader.uniforms.useVSM = { value: state.useVSM };

        // =========================
        // VERTEX SHADER
        // =========================
        shader.vertexShader = `
            uniform mat4 lightMatrix;
            varying vec4 vShadowCoord;
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
            `#include <begin_vertex>`,
            `
                #include <begin_vertex>

                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                vShadowCoord = lightMatrix * worldPos;
            `
        );

        // =========================
        // FRAGMENT SHADER
        // =========================
        shader.fragmentShader = `
            uniform sampler2D shadowMapCustom;
            uniform bool usePCF;
            uniform bool useVSM;
            uniform float bias;

            varying vec4 vShadowCoord;

            float getShadowBasic(vec2 uv, float depth) {
                float closest = texture2D(shadowMapCustom, uv).r;
                return step(closest + bias, depth);
            }

            float getShadowPCF(vec2 uv, float depth) {

                float shadow = 0.0;

                float texel = 1.0 / 4096.0;

                for (int x = -1; x <= 1; x++) {
                    for (int y = -1; y <= 1; y++) {

                        vec2 offset = vec2(float(x), float(y)) * texel;

                        float closest = texture2D(shadowMapCustom, uv + offset).r;

                        shadow += step(closest + bias, depth);
                    }
                }

                return shadow / 9.0;
            }
            
            float chebyshevUpperBound(vec2 moments, float t) {

                float mean = moments.x;
                float mean2 = moments.y;

                float variance = max(mean2 - mean * mean, 0.00002);

                float d = t - mean;

                float p = variance / (variance + d * d);

                return clamp(p, 0.0, 1.0);
            }

            float getVSMShadow(vec2 uv, float depth) {

                vec2 moments = texture2D(shadowMapCustom, uv).xy;
                
                float t = depth - bias;

                float p = chebyshevUpperBound(moments, t);

                // light bleeding fix
                return clamp(max(p, step(depth, moments.x)), 0.0, 1.0);
            }
        ` + shader.fragmentShader;

        // =========================
        // APPLY SHADOW
        // =========================
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <dithering_fragment>`,
            `
                vec3 proj = vShadowCoord.xyz / vShadowCoord.w;
                proj = proj * 0.5 + 0.5;

                float depth = proj.z;
                float shadow;

                if (useVSM) {
                    shadow = getVSMShadow(proj.xy, depth);
                }
                else if (usePCF) {
                    shadow = getShadowPCF(proj.xy, depth);
                }
                else {
                    shadow = getShadowBasic(proj.xy, depth);
                }

                diffuseColor.rgb *= (1.0 - shadow);

                #include <dithering_fragment>
            `
        );

        // =========================
        // STORE REF FOR UPDATE
        // =========================
        mesh.userData._shadowShader = shader;
    };

    mesh.material.needsUpdate = true;
}