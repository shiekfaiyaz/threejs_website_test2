import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Initialization ---
const container = document.getElementById('container');
const loadingOverlay = document.getElementById('loading-overlay');

let scene, camera, renderer, controls, model;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);

    // Get container dimensions for camera and renderer
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialiasing: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Controls setup (allows user to rotate and zoom)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    // Handle window resizing
    window.addEventListener('resize', onWindowResize, false);
}

// --- Model Loading and Animation ---
function loadModel() {
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onLoad = function () {
        console.log('Model loaded successfully!');
        loadingOverlay.style.display = 'none';
        animate(); // Start animation loop after model is loaded
    };

    loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
        const progress = Math.round((itemsLoaded / itemsTotal) * 100);
        document.getElementById('loading-text').innerText = `Loading... ${progress}%`;
    };

    const loader = new GLTFLoader(loadingManager);

    loader.load(
        './public/scene.gltf',
        function (gltf) {
            model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            scene.add(model);
        },
        undefined,
        function (error) {
            console.error('An error occurred while loading the model:', error);
            document.getElementById('loading-text').innerText = 'Failed to load model.';
        }
    );
}

function animate() {
    requestAnimationFrame(animate);

    // Simple animation: Rotate the model
    if (model) {
        model.rotation.y += 0.005;
    }

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    // Update renderer and camera based on container's size
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerWidth, containerHeight);
}

// Start the application
init();
loadModel();