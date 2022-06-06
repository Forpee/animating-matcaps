import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import gsap from 'gsap';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

let params = {
    progress: 0
};

gui.add(params, 'progress', 0, 1).step(0.01).onChange(() => {
    material.uniforms.progress.value = params.progress;
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(5, 5, 32, 32);

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uTexture: { value: new THREE.TextureLoader().load('/matcap.png') },
        progress: { value: 0 }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
});

// Mesh
const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0xffffff,
}));
scene.add(mesh);
mesh.position.z = 0.4;

// Loaders
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/'); // use a full url path
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('/modelDraco.gltf', (gltf) => {
    // dnaGeo = gltf.scene.children[0].geometry;
    // dnaGeo.center();
    // mesh = new THREE.Points(dnaGeo, material);
    // scene.add(mesh);
    console.log(gltf);
    const mesh = gltf.scene.children[0];
    // traverse to find mesh 
    mesh.traverse(function (child) {
        if (child.isMesh) {
            child.material = material;
        }
    });
    mesh.scale.set(0.025, 0.025, 0.025);
    mesh.position.set(0, 0, 0);
    mesh.rotation.x = Math.PI / 2;
    scene.add(mesh);

});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
window.addEventListener('mousedown', () => {
    gsap.to(mesh.position, {
        duration: 1,
        z: 0.0,
        ease: 'power4.out'
    });
});

window.addEventListener('mouseup', () => {
    gsap.to(mesh.position, {
        duration: 1,
        z: 0.4,
        ease: 'power4.out'
    });
});

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Orthographic camera
// const camera = new THREE.OrthographicCamera(-1/2, 1/2, 1/2, -1/2, 0.1, 100)

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    // Update controls
    controls.update();

    // Get elapsedtime
    const elapsedTime = clock.getElapsedTime();

    // Update uniforms
    material.uniforms.uTime.value = elapsedTime;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();