import * as THREE from 'three'
import Stats from 'stats-js'
import { Fluid } from './Fluid'

const renderer = new THREE.WebGLRenderer({
  antialias: true
})

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-100, 100, 100, -100)

const fluid = new Fluid()
scene.add(fluid.mesh)

const stats = new Stats()

function render(): void {
  requestAnimationFrame(render)
  stats.begin()
  renderer.render(scene, camera)
  stats.end()
}

requestAnimationFrame(render)

const dom = renderer.domElement
dom.style.cssText = 'position: absolute; top: 0; left: 0'
document.body.appendChild(dom)

stats.dom.style.cssText = 'position: absolute; top: 0; left: 0'
document.body.appendChild(stats.dom)

function updateSize(): void {
  const w = window.innerWidth
  const h = window.innerHeight
  const r = window.devicePixelRatio
  renderer.setSize(w, h)
  renderer.setPixelRatio(r)

  camera.top = -h / 2
  camera.bottom = h / 2
  camera.left = -w / 2
  camera.right = w / 2
  camera.updateProjectionMatrix()
}

window.addEventListener('resize', updateSize)
updateSize()
