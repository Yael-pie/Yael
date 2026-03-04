import * as THREE from 'three'

let leftPart = 300

// Canvas
const canvas = document.getElementById('right_content_bg_canva')

// Scène
const scene = new THREE.Scene()

// Lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(5, 5, 5)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight)

const fillLight = new THREE.DirectionalLight(0x8899ff, 0.5)
fillLight.position.set(-5, 0, -3)
scene.add(fillLight)

// Tailles
const sizes = {
    width: window.innerWidth - leftPart,
    height: window.innerHeight
}

// Objet
const bonhomme_sphere_geometry = new THREE.SphereGeometry(0.5, 64, 64)
const bonhomme_sphere_material = new THREE.MeshStandardMaterial({ 
    color: 0x60e28c,
    roughness: 0.7,
    metalness: 0
})
const bonhomme_sphere = new THREE.Mesh(bonhomme_sphere_geometry, bonhomme_sphere_material)
bonhomme_sphere.castShadow = true
bonhomme_sphere.receiveShadow = true
scene.add(bonhomme_sphere)

const bonhome_sphere_first_eye_geometry = new THREE.SphereGeometry(0.1, 32, 32)
const bonhome_sphere_first_eye_material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
const bonhome_sphere_first_eye = new THREE.Mesh(bonhome_sphere_first_eye_geometry, bonhome_sphere_first_eye_material)
bonhome_sphere_first_eye.position.set(0.15, 0.1, 0.45)
bonhome_sphere_first_eye.castShadow = true
bonhome_sphere_first_eye.receiveShadow = true
scene.add(bonhome_sphere_first_eye)

const bonhome_sphere_second_eye_geometry = new THREE.SphereGeometry(0.1, 32, 32)
const bonhome_sphere_second_eye_material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
const bonhome_sphere_second_eye = new THREE.Mesh(bonhome_sphere_second_eye_geometry, bonhome_sphere_second_eye_material)
bonhome_sphere_second_eye.position.set(-0.15, 0.1, 0.45)
bonhome_sphere_second_eye.castShadow = true
bonhome_sphere_second_eye.receiveShadow = true
scene.add(bonhome_sphere_second_eye)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.outputColorSpace = THREE.SRGBColorSpace

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth - leftPart
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()