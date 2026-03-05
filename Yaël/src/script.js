import * as THREE from 'three'

let leftPart = 300

let ecart = Math.min(1.5, Math.max(1.0, (window.innerWidth - leftPart) / 1000))

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

// Classe Bonhomme
class Bonhomme {
    constructor(xFactor, yFactor, zFactor, radius, eyeTexture) {
        // Stocker les facteurs de position relative pour le resize
        this.xFactor = xFactor
        this.yFactor = yFactor
        this.zFactor = zFactor
        
        const geometry = new THREE.SphereGeometry(radius, 32, 32)
        const material = new THREE.MeshStandardMaterial({ color: 0x60e28c })
        this.material = material
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
        // Calculer position initiale avec ecart
        this.mesh.position.set(xFactor * ecart, yFactor * ecart, zFactor)

        // premier oeil (proportionnel au rayon du bonhomme)
        const eyeSize = radius * 0.2
        const eyeGeometry1 = new THREE.SphereGeometry(eyeSize, 32, 32)
        const eyeMaterial1 = new THREE.MeshStandardMaterial({ 
            map: eyeTexture,
            roughness: 0.3,
            metalness: 0
        })
        this.firstEye = new THREE.Mesh(eyeGeometry1, eyeMaterial1)
        this.firstEye.position.set(0.3 * radius, 0.2 * radius, 0.9 * radius)
        this.firstEye.rotation.y = -Math.PI / 2
        this.firstEye.castShadow = true
        this.firstEye.receiveShadow = true
        this.mesh.add(this.firstEye)

        // second
        const eyeGeometry2 = new THREE.SphereGeometry(eyeSize, 32, 32)
        const eyeMaterial2 = new THREE.MeshStandardMaterial({ 
            map: eyeTexture,
            roughness: 0.3,
            metalness: 0
        })
        this.secondEye = new THREE.Mesh(eyeGeometry2, eyeMaterial2)
        this.secondEye.position.set(-0.3 * radius, 0.2 * radius, 0.9 * radius)
        this.secondEye.rotation.y = -Math.PI / 2
        this.secondEye.castShadow = true
        this.secondEye.receiveShadow = true
        this.mesh.add(this.secondEye)
    }

    addToScene(scene) {
        scene.add(this.mesh)
    }

    updateEyesRotation(eyeRotationX, eyeRotationY) {
        this.firstEye.rotation.x = eyeRotationX
        this.firstEye.rotation.y = eyeRotationY - Math.PI / 2
        this.secondEye.rotation.x = eyeRotationX
        this.secondEye.rotation.y = eyeRotationY - Math.PI / 2
    }

    changeColor() {
        this.material.color.setHex(Math.random() * 0xffffff)
    }

    setScale(scale) {
        this.mesh.scale.set(scale, scale, scale)
    }

    lookAt(target) {
        this.mesh.lookAt(target)
    }

    updateEye(event) {
        const rect = canvas.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        const eyeRotationX = -mouse.y * 0.3
        const eyeRotationY = mouse.x * 0.3

        this.updateEyesRotation(eyeRotationX, eyeRotationY)
    }

    updateColor(event) {
        const rect = canvas.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObject(this.mesh)
        if (intersects.length > 0) {
            this.changeColor()
        }
    }

    updateScale() {
        const newRadius = Math.min(0.5, Math.max(0.3, (sizes.width / 1000) * 0.5))
        const scale = newRadius / bonhommeRadius
        this.setScale(scale)
    }

    updatePos() {
        this.mesh.position.set(this.xFactor * ecart, this.yFactor * ecart, this.zFactor)
    }
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Créer un bonhomme
const bonhomme = new Bonhomme(0, 0, 0, bonhommeRadius, eyeTexture)
const bonhomme2 = new Bonhomme(1, 0, 0, bonhommeRadius, eyeTexture)
const bonhomme3 = new Bonhomme(-1, 0, 0, bonhommeRadius, eyeTexture)
const bonhomme4 = new Bonhomme(0, 1, 0, bonhommeRadius, eyeTexture)
const bonhommeb5 = new Bonhomme(1, 1, 0, bonhommeRadius, eyeTexture)
const bonhommeb6 = new Bonhomme(-1, 1, 0, bonhommeRadius, eyeTexture)
const bonhomme7 = new Bonhomme(0, -1, 0, bonhommeRadius, eyeTexture)
const bonhommeb8 = new Bonhomme(1, -1, 0, bonhommeRadius, eyeTexture)
const bonhommeb69 = new Bonhomme(-1, -1, 0, bonhommeRadius, eyeTexture)

bonhomme.addToScene(scene)
bonhomme2.addToScene(scene)
bonhomme3.addToScene(scene)
bonhomme4.addToScene(scene)
bonhommeb5.addToScene(scene)
bonhommeb6.addToScene(scene)
bonhomme7.addToScene(scene)
bonhommeb8.addToScene(scene)
bonhommeb69.addToScene(scene)

bonhomme.lookAt(camera.position)
bonhomme2.lookAt(camera.position)
bonhomme3.lookAt(camera.position)
bonhomme4.lookAt(camera.position)
bonhommeb5.lookAt(camera.position)
bonhommeb6.lookAt(camera.position)
bonhomme7.lookAt(camera.position)
bonhommeb8.lookAt(camera.position)
bonhommeb69.lookAt(camera.position)

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

document.addEventListener('mousemove', (event) => {
    bonhomme.updateEye(event)
    bonhomme2.updateEye(event)
    bonhomme3.updateEye(event)
    bonhomme4.updateEye(event)
    bonhommeb5.updateEye(event)
    bonhommeb6.updateEye(event)
    bonhomme7.updateEye(event)
    bonhommeb8.updateEye(event)
    bonhommeb69.updateEye(event)
})

canvas.addEventListener('click', (event) => {
    bonhomme.updateColor(event)
    bonhomme2.updateColor(event)
    bonhomme3.updateColor(event)
    bonhomme4.updateColor(event)
    bonhommeb5.updateColor(event)
    bonhommeb6.updateColor(event)
    bonhomme7.updateColor(event)
    bonhommeb8.updateColor(event)
    bonhommeb69.updateColor(event)
})

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth - leftPart
    sizes.height = window.innerHeight

    ecart = Math.min(1.5, Math.max(1.0, (window.innerWidth - leftPart) / 1000))
    bonhomme.updatePos()
    bonhomme2.updatePos()
    bonhomme3.updatePos()
    bonhomme4.updatePos()
    bonhommeb5.updatePos()
    bonhommeb6.updatePos()
    bonhomme7.updatePos()
    bonhommeb8.updatePos()
    bonhommeb69.updatePos()

    // Mettre à jour le rayon du bonhomme (min 0.3, max 0.5) scaler
    bonhomme.updateScale()
    bonhomme2.updateScale()
    bonhomme3.updateScale()
    bonhomme4.updateScale()
    bonhommeb5.updateScale()
    bonhommeb6.updateScale()
    bonhomme7.updateScale()
    bonhommeb8.updateScale()
    bonhommeb69.updateScale()

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