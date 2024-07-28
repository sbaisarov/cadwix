import * as THREE from 'three';
import { canvas } from '../globals.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

let renderer, scene, camera;

init();

function init() {

  const container = document.getElementById( 'container3D' );
  container.style.width = canvas.width + 'px';
  container.style.height = canvas.height + 'px';

  //

  camera = new THREE.PerspectiveCamera( 50, canvas.width / canvas.height, 1, 1000 );
  camera.position.set( 0, 0, 200 );

  //

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( canvas.width, canvas.height );
  container.appendChild( renderer.domElement );

  //

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  controls.screenSpacePanning = true;

  //

  window.addEventListener( 'resize', onWindowResize );

  loadSVG();

}

function loadSVG() {

  //

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xb0b0b0 );

  //

  const axesHelper = new THREE.AxesHelper( 100 );
  scene.add( axesHelper );

  const loader = new SVGLoader();

  let svg = canvas.toSVG();

  let data = loader.parse(svg);


  let renderOrder = 0;

  const group = new THREE.Group();
  group.scale.multiplyScalar( 0.25 );
  group.scale.y *= - 1; // invert the y-axis

  for ( const path of data.paths ) {
    const fillColor = path.userData.style.fill;
    const material = new THREE.MeshBasicMaterial( {
      color: new THREE.Color().setStyle( fillColor ),
      opacity: path.userData.style.fillOpacity,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    } );

    const shapes = SVGLoader.createShapes( path );

    for ( const shape of shapes ) {

      const geometry = new THREE.ExtrudeGeometry(shape, {depth: 5, bevelEnabled: false});
      const mesh = new THREE.Mesh( geometry, material );
      mesh.renderOrder = renderOrder ++;

      group.add( mesh );

    }

  }

  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);

  const yOffset = size.y / 2;
  const xOffset = size.x / -2;

  // Offset all of group's elements, to center them
  group.position.y = yOffset;
  group.position.x = xOffset;

  scene.add( group );

  render();
}

function onWindowResize() {

  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();

  renderer.setSize( canvas.width, canvas.height );
  render();

}

function render() {

  renderer.render( scene, camera );

}

canvas.on("mouse:up", function() {
    loadSVG();
});