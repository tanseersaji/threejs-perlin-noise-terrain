import './style.css'
import * as THREE from 'three'
const webGLCanvas = document.getElementById('webgl')
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const { noise } = require('@chriscourses/perlin-noise')
import terrainVertexShader from './shaders/perlinTerrain/vertex.glsl'
import terrainFragmentShader from './shaders/perlinTerrain/fragment.glsl'

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0xa325f7, 0.1)
scene.background = new THREE.Color(0xa325f7)

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
camera.position.z = 15
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: webGLCanvas,
    antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.physicallyCorrectLights = true

const controls = new OrbitControls(camera, renderer.domElement)

/*
 * Terrain Plain
 */

const terrainGeometry = new THREE.PlaneBufferGeometry(30, 30, 32, 32)

const count = terrainGeometry.attributes.position.count
const randoms = new Float32Array(count)

for(let i = 0; i < count; i++)
{
    randoms[i] = Math.random()
}
terrainGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
const terrainMaterial = new THREE.RawShaderMaterial({
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader
})
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
scene.add(terrain)

const clock = new THREE.Clock()

const animate = () => {
    requestAnimationFrame(animate)
    controls.update()

    const elapsedTime = clock.getElapsedTime()

    for(let i = 0; i < count; i++)
    {
        randoms[i] = noise(elapsedTime * 0.1 + i)
    }
    terrainGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

    renderer.render(scene, camera)
}

animate()