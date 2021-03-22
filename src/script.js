import './style.css'

import * as THREE from 'three'

const webGLCanvas = document.getElementById('webgl')
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5
scene.add(camera)

const ambientLight = new THREE.AmbientLight("#ffffff", 1)
scene.add(ambientLight)

const renderer = new THREE.WebGLRenderer({
    canvas: webGLCanvas,
    antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.physicallyCorrectLights = true

const controls = new OrbitControls(camera, renderer.domElement)

/*
 * Test Sphere
 */

const directionalLight = new THREE.DirectionalLight("#ffffff", 2)
directionalLight.position.set(30.25, 30, 30)
scene.add(directionalLight)

const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32)
const sphereMaterial = new THREE.MeshStandardMaterial()
sphereMaterial.color = new THREE.Color("#ffffff")
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

animate()