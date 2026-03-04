import * as THREE from 'three'

let leftPart = 300

// Canvas
const canvas = document.getElementById('right_content_bg_canva')

// Scène
const scene = new THREE.Scene()

const randomColor = Math.random() * 0xffffff

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

// Chargement de la texture d'œil
const textureLoader = new THREE.TextureLoader()
const eyeTexture = textureLoader.load('./textures/eye.jpg')
eyeTexture.colorSpace = THREE.SRGBColorSpace

// Tailles
const sizes = {
    width: window.innerWidth - leftPart,
    height: window.innerHeight
}

// Calculer le rayon du bonhomme en fonction de la largeur (min 0.3, max 0.5)
const bonhommeRadius = Math.min(0.5, Math.max(0.3, (sizes.width / 1000) * 0.5))

// Objet
const bonhomme_geometry = new THREE.SphereGeometry(bonhommeRadius, 64, 64)
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
const bonhome_first_eye_material = new THREE.MeshStandardMaterial({ 
    map: eyeTexture,
    roughness: 0.3,
    metalness: 0
})
const bonhome_first_eye = new THREE.Mesh(bonhome_first_eye_geometry, bonhome_first_eye_material)
bonhome_first_eye.position.set(0.3 * bonhommeRadius, 0.2 * bonhommeRadius, 0.9 * bonhommeRadius)
bonhome_first_eye.rotation.y = -Math.PI / 2
bonhome_first_eye.castShadow = true
bonhome_first_eye.receiveShadow = true
bonhomme.add(bonhome_first_eye)

const bonhome_second_eye_geometry = new THREE.SphereGeometry(0.1, 32, 32)
const bonhome_second_eye_material = new THREE.MeshStandardMaterial({ 
    map: eyeTexture,
    roughness: 0.3,
    metalness: 0
})
const bonhome_second_eye = new THREE.Mesh(bonhome_second_eye_geometry, bonhome_second_eye_material)
bonhome_second_eye.position.set(-0.3 * bonhommeRadius, 0.2 * bonhommeRadius, 0.9 * bonhommeRadius)
bonhome_second_eye.rotation.y = -Math.PI / 2
bonhome_second_eye.castShadow = true
bonhome_second_eye.receiveShadow = true
bonhomme.add(bonhome_second_eye)

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

// Détection de clic sur le bonhomme
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    const eyeRotationX = -mouse.y * 0.3
    const eyeRotationY = mouse.x * 0.3

    bonhome_first_eye.rotation.x = eyeRotationX
    bonhome_first_eye.rotation.y = eyeRotationY - Math.PI / 2
    
    bonhome_second_eye.rotation.x = eyeRotationX
    bonhome_second_eye.rotation.y = eyeRotationY - Math.PI / 2
})

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(bonhomme)
    if (intersects.length > 0) {
        bonhomme.material.color.setHex(Math.random() * 0xffffff)
    }
})

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth - leftPart
    sizes.height = window.innerHeight

    // Mettre à jour le rayon du bonhomme (min 0.3, max 0.5)
    const newRadius = Math.min(0.5, Math.max(0.3, (sizes.width / 1000) * 0.5))
    const scale = newRadius / bonhommeRadius
    bonhomme.scale.set(scale, scale, scale)

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