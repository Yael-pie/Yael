import * as THREE from 'three'

const gummy_boy = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const sizes = {
    width: 800,
    height: 600
}

const camera_gummy_boy = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera_gummy_boy.position.z = 3
scene.add(camera_gummy_boy)

const renderer = new THREE.WebGLRenderer({
    canvas: gummy_boy
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera_gummy_boy)