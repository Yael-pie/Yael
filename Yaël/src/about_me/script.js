import * as THREE from 'three'
import gsap from 'gsap'

/**
 * Debug
 */

const parameters = {
    materialColor: '#d3d3d3'
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */

// Meshes
const objectdistance = 4

const material = new THREE.MeshBasicMaterial({color: parameters.materialColor, wireframe: true})

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.OctahedronGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = - objectdistance * 0
mesh2.position.y = - objectdistance * 1
mesh3.position.y = - objectdistance * 2

if (window.innerWidth <= 1380) {
    mesh1.position.x = 0
    mesh2.position.x = 0
    mesh3.position.x = 0
} else {
    mesh1.position.x = 2
    mesh2.position.x = - 2
    mesh3.position.x = 2
}

scene.add(mesh1, mesh2, mesh3)

const sectionmeshes = [ mesh1, mesh2, mesh3 ]

// Particles
let particlescount = 200
const positions = new Float32Array(particlescount * 3)
for (let i = 0; i < particlescount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectdistance * 0.5 - Math.random() * objectdistance * sectionmeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const particlesgeometry = new THREE.BufferGeometry()
particlesgeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesmaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(particlesgeometry, particlesmaterial)
scene.add(particles)

// Cursor

const cursor = {x: 0, y: 0}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.width - 0.5
})

// Lights

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
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

    if (window.innerWidth <= 1380) {
        mesh1.position.x = 0
        mesh2.position.x = 0
        mesh3.position.x = 0
    } else {
        mesh1.position.x = 2
        mesh2.position.x = - 2
        mesh3.position.x = 2
    }
})

/**
 * Camera
 */
// Base camera
const cameragroup = new THREE.Group()
scene.add(cameragroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)
cameragroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Sroll
let scrollY = window.scrollY
let currentsection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    const newsection = Math.round(scrollY / sizes.height)
    if (currentsection != newsection) {
        currentsection = newsection

        gsap.to(
            sectionmeshes[currentsection].rotation, {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previoustime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltatime = elapsedTime - previoustime
    previoustime = elapsedTime

    camera.position.y = - scrollY / sizes.height * objectdistance
    // Parallax
    const parallaxx = cursor.x
    const parallaxy = - cursor.y
    cameragroup.position.x += (parallaxx - cameragroup.position.x) * 1.5 * deltatime
    cameragroup.position.y += (parallaxy - cameragroup.position.y) * 1.5 * deltatime

    // Animate meshes
    for (const mesh of sectionmeshes) {
        mesh.rotation.x += deltatime * 0.1
        mesh.rotation.y += deltatime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()