import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

let svg = canvas.toSVG();

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, canvas.innerWidth / canvas.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.width, canvas.height);
document.getElementById('container3D').appendChild(renderer.domElement);

let material = new THREE.MeshBasicMaterial({color: 0x00ff00});

// Create a loader to load the SVG
let loader = new SVGLoader();

// Load the SVG
let paths = loader.parse(svg);

// Create a group to hold the shapes
let group = new THREE.Group();

// For each path in the SVG
for (let i = 0; i < paths.length; i++) {
    let path = paths[i];

    // Convert the path into a shape
    let shapes = path.toShapes(true);

    // For each shape
    for (let j = 0; j < shapes.length; j++) {
        let shape = shapes[j];

        // Create a geometry from the shape
        let geometry = new THREE.ShapeBufferGeometry(shape);

        // Create a mesh from the geometry
        let mesh = new THREE.Mesh(geometry, material);

        // Add the mesh to the group
        group.add(mesh);
    }
}

// Add the group to the scene
scene.add(grooup);