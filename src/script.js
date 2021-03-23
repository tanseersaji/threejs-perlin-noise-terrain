import './style.css'
import * as THREE from 'three'
const webGLCanvas = document.getElementById('webgl')
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const { noise } = require('@chriscourses/perlin-noise')

import terrainVertexShader from './shaders/perlinTerrain/vertex.glsl'
import terrainFragmentShader from './shaders/perlinTerrain/fragment.glsl'

import * as dat from 'dat.gui'

const scene = new THREE.Scene()
// scene.fog = new THREE.Fog("#1C2541", 0.1, 65)
scene.background = new THREE.Color("#1C2541")

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const gui = new dat.GUI()
gui.hide()
const options = {}

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
camera.position.z = 15
scene.add(camera)

const ambientLight = new THREE.AmbientLight("#ffffff", 2)
scene.add(ambientLight)

const renderer = new THREE.WebGLRenderer({
    canvas: webGLCanvas,
    antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.physicallyCorrectLights = true

// const controls = new OrbitControls(camera, renderer.domElement)

/*
 * Textures
 */

const textureLoader = new THREE.TextureLoader()
const planetTexture = textureLoader.load('textures/jupiter.jpg')

/*
 * Terrain Plain
 */

const terrainGeometry = new THREE.PlaneBufferGeometry(60, 30, 64, 32)

const count = terrainGeometry.attributes.position.count
const randoms = new Float32Array(count)

for(let i = 0; i < count; i++)
{
    randoms[i] = Math.random()
}
terrainGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
const terrainMaterial = new THREE.RawShaderMaterial({
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
    // fog: true
})

const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
terrain.position.y = -2;
terrain.rotation.x = - Math.PI / 2;
scene.add(terrain)

/*
 * Planet
 */

options.planetRadius = 36.2
const planetGeometry = new THREE.SphereBufferGeometry(1, 64, 64)
const planetMaterial = new THREE.MeshStandardMaterial()

planetMaterial.map = planetTexture
planetMaterial.color = new THREE.Color("#402f64")


const planet = new THREE.Mesh(planetGeometry, planetMaterial)

planet.scale.set(options.planetRadius, options.planetRadius, options.planetRadius)

gui.add(options, 'planetRadius').min(0).max(50).step(0.1).name("PlanetRadius")
    .onFinishChange(()=>{
        planet.scale.set(options.planetRadius, options.planetRadius, options.planetRadius)
    })

planet.position.set(-30.7, -2.5, -50)

planet.rotation.set(5.76, 0.67, 3.59)

gui.add(planet.rotation, 'x').min(0).max(359 * Math.PI / 180).step(0.01)
    .name("PlanetRotationX")
gui.add(planet.rotation, 'y').min(0).max(359 * Math.PI / 180).step(0.01)
    .name("PlanetRotationY")
gui.add(planet.rotation, 'z').min(0).max(359 * Math.PI / 180).step(0.01)
    .name("PlanetRotationZ")

gui.add(planet.position, 'x').min(-100).max(50).step(0.1).name("PlanetPositionX")
gui.add(planet.position, 'y').min(-100).max(50).step(0.1).name("PlanetPositionY")
gui.add(planet.position, 'z').min(-100).max(50).step(0.1).name("PlanetPositionZ")

scene.add(planet)

/*
 * Sun
 */

const sun = new THREE.DirectionalLight("#ffffff", 2.1)

sun.position.set(157.5, 38.3, 97.9)

gui.add(sun.position, 'x').min(-50).max(500).step(0.1).name("SunPositionX")
gui.add(sun, 'intensity').min(1).max(10).step(0.1).name("SunIntensity")
gui.add(sun.position, 'y').min(-50).max(500).step(0.1).name("SunPositionY")
gui.add(sun.position, 'z').min(-50).max(500).step(0.1).name("SunPositionZ")

scene.add(sun)

/*
 * Stars
 */

const startCount = 5000
const starsGeometry = new THREE.BufferGeometry()
const starPositions = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
    const i3 = i * 3
    starPositions[i3] = (Math.random() - 0.5) * 500
    starPositions[i3 + 1] = (Math.random() - 0.5) * 500
    starPositions[i3 + 2] = ((Math.random() - 0.5) * 50) - 70
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
const starMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})

const stars = new THREE.Points(starsGeometry, starMaterial)
scene.add(stars)
/*
 * Camera Animations
 */
const mouse = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', event => {
    mouse.x = ((event.clientX / sizes.width) - 0.5) * 2
    mouse.y = - (event.clientY / sizes.height - 0.5) * 2
})

const clock = new THREE.Clock()

const animate = () => {
    requestAnimationFrame(animate)
    // controls.update()

    const elapsedTime = clock.getElapsedTime()

    for(let i = 0; i < count; i++)
    {
        randoms[i] = noise(elapsedTime * 0.3 + i)
    }
    terrainGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

    planet.rotation.y = - elapsedTime * 2 * Math.PI / 180
    planet.rotation.z =  elapsedTime * Math.PI / 180

    camera.position.x = mouse.x / 3
    camera.position.y = mouse.y / 10

    renderer.render(scene, camera)
}

animate()