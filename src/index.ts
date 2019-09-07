import * as THREE from 'three'
import { RenderPass, EffectComposer } from 'postprocessing'
import Stats from 'stats-js'
import { Fluid } from './Fluid'
// import { WaterEffect } from './WaterEffect'

const renderer = new THREE.WebGLRenderer({
  antialias: true
})
const composer = new EffectComposer(renderer)

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-100, 100, 100, -100)
camera.position.set(0, 0, 10)
camera.lookAt(0, 0, 0)

const renderPass = new RenderPass(scene, camera)
renderPass.renderToScreen = true
composer.addPass(renderPass)

// const waterEffect = new WaterEffect()
// console.log(waterEffect.pass)
// waterEffect.pass.renderToScreen = true
// composer.addPass(waterEffect.pass)

const fluid = new Fluid(renderer, camera)
scene.add(fluid.mesh)

const pointerPos = new THREE.Vector2()

const stats = new Stats()

const dom = renderer.domElement
dom.style.cssText = 'position: absolute; top: 0; left: 0'
document.body.appendChild(dom)

stats.dom.style.cssText = 'position: absolute; top: 0; left: 0'
// document.body.appendChild(stats.dom)

let isTouching = false
let cursorSize = 0

let isColorTouching = false
let colorPos = 0.1

let isDirTouching = false
let dirPos = 0.27

let isSTouching = false
let sPos = Math.PI / 2

let speed = 0.05

const debugDom = document.createElement('div')
debugDom.style.cssText =
  'position: absolute; bottom: 0; right: 0; text-align: right; font-size: 11px; color: #888'
document.body.appendChild(debugDom)

function render(): void {
  requestAnimationFrame(render)

  stats.begin()

  fluid.update(pointerPos)
  composer.render(Date.now())

  if (isTouching) {
    cursorSize = Math.min(Math.max(cursorSize + 1, 100), 200)
  } else {
    cursorSize = Math.max(0, cursorSize * 0.97)
  }

  if (isColorTouching) {
    colorPos += 0.005
    if (colorPos > 1) colorPos -= 1
  }

  if (isDirTouching) {
    dirPos += 0.001
    if (dirPos > 1) dirPos -= 1
  }

  if (isSTouching) {
    sPos += 0.01
  }

  // speed = Math.max(speed + 0.005 * speedSW, 0)
  const saturation = (Math.sin(sPos) + 1) / 2

  fluid.setCursorSize(cursorSize)
  fluid.setColor(colorPos)
  fluid.setMove(speed, dirPos)
  fluid.setSaturation(saturation)

  debugDom.innerHTML =
    'C=.' +
    Math.floor(colorPos * 100) +
    ' V=.' +
    Math.floor(saturation * 100) +
    ' A/Z/D=.' +
    Math.floor(speed * 1000) +
    ', .' +
    Math.floor(dirPos * 100)

  stats.end()
}

function updateSize(): void {
  const w = window.innerWidth
  const h = window.innerHeight
  const r = window.devicePixelRatio
  renderer.setSize(w, h)
  renderer.setPixelRatio(r)

  camera.top = -h
  camera.bottom = h
  camera.left = -w
  camera.right = w
  camera.position.z = 10
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()

  fluid.updateSize(w, h)
}

window.addEventListener('resize', updateSize)
updateSize()

function onMouseMove(e): void {
  pointerPos.set(e.clientX, e.clientY)
}

window.addEventListener('mousemove', onMouseMove)

function onKeyDown(e): void {
  console.log(e.keyCode)
  if (e.keyCode === 32) isTouching = true
  else if (e.keyCode === 67) isColorTouching = true
  else if (e.keyCode === 68) isDirTouching = true
  else if (e.keyCode === 86) isSTouching = true
  else if (e.keyCode === 65) {
    speed += 0.02
  } else if (e.keyCode === 90) {
    speed = Math.max(0, speed - 0.02)
  }
}

function onKeyUp(e): void {
  if (e.keyCode === 32) isTouching = false
  else if (e.keyCode === 67) isColorTouching = false
  else if (e.keyCode === 68) isDirTouching = false
  else if (e.keyCode === 86) isSTouching = false
}

window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)

document.body.addEventListener('click', () => {
  document.body.requestFullscreen()
})

requestAnimationFrame(render)
