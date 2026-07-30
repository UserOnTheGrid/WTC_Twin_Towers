// Import three.js
import * as THREE from 'three';

function main(){
    // Make our canvas
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Set up Camera
    // Frustrum settings
    const fov = 75; // Field of View
    const aspect = window.innerWidth / window.innerHeight; // Ratio of view's height and width
    const near = 0.1; // Minimum fov value closest to the camera
    const far = 5; // Maximum fov value farthest from the camera
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.z = 5; // Move camera 2 units away from the origin on the z-axis to view the shape

    const height = 13.62;
    const width = 2.09;
    const depth = 2.09;
    
    // Make the scene
    const scene = new THREE.Scene(); // Scene
    const geo = new THREE.BoxGeometry(width, height, depth); // Geometry

    // Apply lighting
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    //const mat = new THREE.MeshBasicMaterial({color: 0x00ff00}); // Material
    const mat = new THREE.MeshPhongMaterial({color: 0x00ff00}); // Material
    
    // Add mesh to scene
    const cube = new THREE.Mesh(geo, mat); // Make a cube mesh
    scene.add(cube); // Scene is the parent of the cube mesh
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

main();