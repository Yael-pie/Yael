import * as THREE from 'three'

// Canvas
const canvas = document.getElementById('right_content_bg_canva')

// Scène
const scene = new THREE.Scene()

// Tailles
const sizes = {
    width: window.innerWidth - 300, // Largeur - left_profile (300px)
    height: window.innerHeight
}

// Caméra (statique pour le momment)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Renderer avec fond transparent
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Handle le ressize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth - 300
    sizes.height = window.innerHeight
    
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animation loop
const animate = () => {
    requestAnimationFrame(animate)
    
    // Anims ici
    
    renderer.render(scene, camera)
}

animate()