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
const bonhomme_geometry = new THREE.SphereGeometry(0.5, 64, 64)
const bonhomme_material = new THREE.MeshStandardMaterial({ 
    color: 0x60e28c,
    roughness: 0.7,
    metalness: 0
})
const bonhomme = new THREE.Mesh(bonhomme_geometry, bonhomme_material)
bonhomme.castShadow = true
bonhomme.receiveShadow = true
scene.add(bonhomme)

const bonhome_first_eye_geometry = new THREE.SphereGeometry(0.1, 32, 32)
const bonhome_first_eye_material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
const bonhome_first_eye = new THREE.Mesh(bonhome_first_eye_geometry, bonhome_first_eye_material)
bonhome_first_eye.position.set(0.15, 0.1, 0.45)
bonhome_first_eye.castShadow = true
bonhome_first_eye.receiveShadow = true
scene.add(bonhome_first_eye)

const bonhome_second_eye_geometry = new THREE.SphereGeometry(0.1, 32, 32)
const bonhome_second_eye_material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
const bonhome_second_eye = new THREE.Mesh(bonhome_second_eye_geometry, bonhome_second_eye_material)
bonhome_second_eye.position.set(-0.15, 0.1, 0.45)
bonhome_second_eye.castShadow = true
bonhome_second_eye.receiveShadow = true
scene.add(bonhome_second_eye)

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