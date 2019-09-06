import * as THREE from 'three'
import { RenderTexture } from './RenderTexture'
import plainVertexShader from './shaders/plainVertexShader.glsl'
// import plainFragmentShader from './shaders/plainFragmentShader.glsl'
import computeData from './shaders/computeData.glsl'
import rendererShader from './shaders/rendererShader.glsl'
import initDataShader from './shaders/initDataShader.glsl'

export class Fluid {
  geometry: THREE.Geometry = new THREE.PlaneGeometry(100, 100)
  materials = {
    compute: new THREE.RawShaderMaterial({
      vertexShader: plainVertexShader,
      fragmentShader: computeData,
      uniforms: {
        worldSize: { type: '2f', value: new THREE.Vector2() },
        pointerPos: { type: '2f', value: null },
        cursorSize: { type: 'f', value: 0 },
        speed: { type: 'f', value: 0 },
        direction: { type: 'f', value: 0 },
        saturation: { type: 'f', value: 0 },
        color: { type: 'f', value: 0 },
        data: { type: 't', value: null }
      }
    }),

    renderer: new THREE.RawShaderMaterial({
      vertexShader: plainVertexShader,
      fragmentShader: rendererShader,
      uniforms: {
        worldSize: { type: '2f', value: new THREE.Vector2() },
        data: { type: 't', value: null }
      }
    })
  }
  mesh: THREE.Mesh = new THREE.Mesh(this.geometry, this.materials.renderer)
  texture: RenderTexture
  renderer: THREE.WebGLRenderer

  constructor(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
    this.renderer = renderer
    this.texture = new RenderTexture({
      width: 100,
      height: 100,
      renderer,
      camera,
      initMaterial: new THREE.RawShaderMaterial({
        vertexShader: plainVertexShader,
        fragmentShader: initDataShader
      })
    })
  }

  public update(pointerPos: THREE.Vector2): void {
    this.materials.compute.uniforms.pointerPos.value = pointerPos
    this.materials.compute.uniforms.data.value = this.texture.getTexture()
    this.texture.setMaterial(this.materials.compute)
    this.texture.render()

    this.materials.renderer.uniforms.data.value = this.texture.getTexture()
    this.renderer.setRenderTarget(null)
  }

  public updateSize(w: number, h: number): void {
    this.materials.compute.uniforms.worldSize.value.set(w, h)
    this.materials.renderer.uniforms.worldSize.value.set(w, h)
    this.texture.updateSize(w, h)
  }

  public setCursorSize(s: number): void {
    this.materials.compute.uniforms.cursorSize.value = s
  }

  public setColor(c: number): void {
    this.materials.compute.uniforms.color.value = c
  }

  public setMove(s: number, c: number): void {
    this.materials.compute.uniforms.speed.value = s
    this.materials.compute.uniforms.direction.value = c
  }

  public setSaturation(c: number): void {
    this.materials.compute.uniforms.saturation.value = c
  }
}
