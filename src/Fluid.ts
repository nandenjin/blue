import * as THREE from 'three'
import plainVertexShader from './shaders/plainVertexShader.glsl'
import plainFragmentShader from './shaders/plainFragmentShader.glsl'

export class Fluid {
  geometry: THREE.BufferGeometry = new THREE.PlaneBufferGeometry(100, 100)
  material: THREE.Material = new THREE.RawShaderMaterial({
    vertexShader: plainVertexShader,
    fragmentShader: plainFragmentShader
  })
  mesh: THREE.Mesh = new THREE.Mesh(this.geometry, this.material)
}
