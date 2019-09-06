import * as THREE from 'three'
import vertexShader from './shaders/plainVertexShader.glsl'
import fragmentShader from './shaders/plainFragmentShader.glsl'

interface RenderTextureCostructorOptions {
  width: number
  height: number
  renderer: THREE.WebGLRenderer
  camera: THREE.Camera
  initMaterial?: THREE.Material
}

export class RenderTexture {
  renderer: THREE.WebGLRenderer
  targets: THREE.WebGLRenderTarget[]
  camera: THREE.Camera
  mesh: THREE.Mesh
  scene: THREE.Scene
  targetIndex = 0
  initMaterial: THREE.Material

  constructor({
    width,
    height,
    renderer,
    camera,
    initMaterial
  }: RenderTextureCostructorOptions) {
    this.renderer = renderer

    const target = new THREE.WebGLRenderTarget(width, height, {
      format: THREE.RGBAFormat
    })
    this.targets = [target, target.clone()]

    this.camera = camera

    this.initMaterial =
      initMaterial ||
      new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader
      })

    const plane = new THREE.PlaneGeometry(100, 100)
    const material = this.initMaterial
    const mesh = new THREE.Mesh(plane, material)
    const scene = new THREE.Scene()
    scene.add(mesh)

    this.mesh = mesh
    this.scene = scene

    renderer.setRenderTarget(this.targets[0])
    renderer.render(scene, camera)
    renderer.setRenderTarget(this.targets[1])
    renderer.render(scene, camera)
  }

  get target(): THREE.WebGLRenderTarget {
    return this.targets[this.targetIndex]
  }

  render(): void {
    ;(this.mesh
      .material as THREE.RawShaderMaterial).uniforms.data.value = this.target.texture
    this.swapTexture()
    this.renderer.setRenderTarget(this.target)
    this.renderer.render(this.scene, this.camera)
  }

  setMaterial(material: THREE.Material): void {
    this.mesh.material = material
    this.mesh.material.needsUpdate = true
  }

  getTexture(): THREE.Texture {
    return this.target.texture
  }

  swapTexture(): void {
    this.targetIndex = ++this.targetIndex % 2
  }

  updateSize(w: number, h: number): void {
    for (let i = 0; i < this.targets.length; i++) {
      this.targets[i].setSize(w, h)
      this.renderer.setRenderTarget(this.targets[i])
      this.setMaterial(this.initMaterial)
      this.renderer.render(this.scene, this.camera)
    }
  }
}
