import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js'
import './animation.js'

/**
 * Base
 */
// Debug

// Canvas
const canvas = document.getElementById('right_content_bg_canva')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

//font ici

//planetes projects et education

const planetsPosition = new Float32Array(1000 * 3)
const planetEducationColors = new Float32Array(3000 * 3)
const planetProjectsColors = new Float32Array(3000 * 3)

const planetsRadius = 1
const planetsGeometry = new THREE.BufferGeometry()

for (let i = 0; i < 1000; i++) {
    const i3_planets = 3 * i

    const phi = Math.acos(-1 + (2 * i) / 1000)
    const theta = Math.sqrt(1000 * Math.PI) * phi

    const x = planetsRadius * Math.cos(theta) * Math.sin(phi)
    const y = planetsRadius * Math.cos(phi)
    const z = planetsRadius * Math.sin(theta) * Math.sin(phi)

    planetsPosition[i3_planets] = x
    planetsPosition[i3_planets + 1] = y
    planetsPosition[i3_planets + 2] = z

    planetEducationColors[i3_planets] = 0.6 + 0.4 * Math.sin(phi * 3)
    planetEducationColors[i3_planets + 1] = Math.random() * 0.2
    planetEducationColors[i3_planets + 2] = 0.1 + 0.2 * Math.cos(theta * 2)

    planetProjectsColors[i3_planets] = 0.1 + 0.2 * Math.sin(theta * 3)
    planetProjectsColors[i3_planets + 1] = 0.6 + 0.4 * Math.cos(phi * 2)
    planetProjectsColors[i3_planets + 2] = Math.random() * 0.2
}

planetsGeometry.setAttribute('position', new THREE.BufferAttribute(planetsPosition, 3))

const planetsGeometryEducation = new THREE.BufferGeometry()
planetsGeometryEducation.setAttribute('position', new THREE.BufferAttribute(planetsPosition, 3))
planetsGeometryEducation.setAttribute('color', new THREE.BufferAttribute(planetEducationColors, 3))

const planetsGeometryProjects = new THREE.BufferGeometry()
planetsGeometryProjects.setAttribute('position', new THREE.BufferAttribute(planetsPosition, 3))
planetsGeometryProjects.setAttribute('color', new THREE.BufferAttribute(planetProjectsColors, 3))


// material
const planetsMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

// points
const planetProjects = new THREE.Points(planetsGeometryProjects, planetsMaterial)
scene.add(planetProjects)
planetProjects.position.set(-10, 3)

const planetEducation = new THREE.Points(planetsGeometryEducation, planetsMaterial)
planetEducation.position.set(10, 3)
scene.add(planetEducation)

// galaxie

const parameters = {}
parameters.count = 260000
parameters.size = 0.01
parameters.radius = 5
parameters.branches = 3
parameters.spin = 3.67
parameters.randomness = 2.6
parameters.randomnessPower = 3
parameters.insideColor = '#7bff00'
parameters.outsideColor = '#0020ac'

let particlesGeometry = null
let particlesMaterial = null
let particlesPoints = null

function generateGalaxy() {

    //new galaxy
    if (particlesPoints !== null) {
        particlesGeometry.dispose()
        particlesMaterial.dispose()
        scene.remove(particlesPoints)
    }

    //geometry
    particlesGeometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        const particlesRadius = Math.random() * parameters.radius
        const branch_nb = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const spinAngle = particlesRadius * parameters.spin

        const particlesRandomX = Math.pow((Math.random() - 0.5), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness
        const particlesRandomY = Math.pow((Math.random() - 0.5), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness
        const particlesRandomZ = Math.pow((Math.random() - 0.5), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness

        positions[i3] = Math.cos(branch_nb + spinAngle) * particlesRadius + particlesRandomX
        positions[i3 + 1] = particlesRandomY
        positions[i3 + 2] = Math.sin(branch_nb + spinAngle) * particlesRadius + particlesRandomZ

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, particlesRadius / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // material
    particlesMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    // points
    particlesPoints = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesPoints)
}

generateGalaxy()

/**
 * Sizes
 */
const sizes = {
    width: canvas.parentElement.offsetWidth,
    height: canvas.parentElement.offsetHeight
}

// check pour replacer
if (document.documentElement.clientWidth <= 1510) {
    planetEducation.visible = false
    planetProjects.visible = false
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = canvas.parentElement.offsetWidth
    sizes.height = canvas.parentElement.offsetHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //update disposition
    if (document.documentElement.clientWidth <= 1510) {
        planetEducation.visible = false
        planetProjects.visible = false
    } else {
        planetEducation.visible = true
        planetProjects.visible = true
    }
})

/**
 * Camera
 */
// Base camera (high to see my galaxy)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 10
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = true
controls.enablePan = false
// Limiter le dezoom à la distance de la caméra de base
const initialDistance = Math.sqrt(camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2)
controls.maxDistance = initialDistance

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true

/**
 * Particle Box Décor (en gros étoiles)
 */
function generateParticleBox() {
    const boxSize = 100
    const particleCount = 5000
    
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
        const face = Math.floor(i / (particleCount / 6))
        const posInFace = i % (particleCount / 6)

        const i3 = i * 3
        const randomU = Math.random()
        const randomV = Math.random()

        if (face === 0) {
            positions[i3] = (randomU - 0.5) * boxSize
            positions[i3 + 1] = (randomV - 0.5) * boxSize
            positions[i3 + 2] = boxSize / 2
        } else if (face === 1) {
            positions[i3] = (randomU - 0.5) * boxSize
            positions[i3 + 1] = (randomV - 0.5) * boxSize
            positions[i3 + 2] = -boxSize / 2
        } else if (face === 2) {
            positions[i3] = boxSize / 2
            positions[i3 + 1] = (randomV - 0.5) * boxSize
            positions[i3 + 2] = (randomU - 0.5) * boxSize
        } else if (face === 3) {
            positions[i3] = -boxSize / 2
            positions[i3 + 1] = (randomV - 0.5) * boxSize
            positions[i3 + 2] = (randomU - 0.5) * boxSize
        } else if (face === 4) {
            positions[i3] = (randomU - 0.5) * boxSize
            positions[i3 + 1] = boxSize / 2
            positions[i3 + 2] = (randomV - 0.5) * boxSize
        } else {
            positions[i3] = (randomU - 0.5) * boxSize
            positions[i3 + 1] = -boxSize / 2
            positions[i3 + 2] = (randomV - 0.5) * boxSize
        }
        sizes[i] = Math.random() * 0.5 + 0.1
    }

    const boxGeometry = new THREE.BufferGeometry()
    boxGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    boxGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const boxMaterial = new THREE.PointsMaterial({
        size: 0.3,
        sizeAttenuation: true,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })

    const particleBox = new THREE.Points(boxGeometry, boxMaterial)
    scene.add(particleBox)

    return particleBox
}

const particleBox = generateParticleBox()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // orbit controls update
    controls.update()

    particleBox.position.copy(camera.position)

    particleBox.rotation.x += 0.00005
    particleBox.rotation.y += 0.00008

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()