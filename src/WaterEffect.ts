// import * as THREE from 'three'
import { ShaderPass, BlurEffect, EffectPass } from 'postprocessing'
import vertexShader from './shaders/waterEffectVertexShader.glsl'
import fragmentShader from './shaders/waterEffectFragmentShader.glsl'
import { PerspectiveCamera } from 'three'

export class WaterEffect {
  // pass = new ShaderPass({
  //   vertexShader: vertexShader,
  //   fragmentShader: fragmentShader
  // })
  pass = new EffectPass(new PerspectiveCamera(), new BlurEffect())
}
