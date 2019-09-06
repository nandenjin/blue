void main() {
  vec2 pos = gl_FragCoord.xy;
  gl_FragColor = vec4(0.5, 0.5 + pos * 0.01, 0.0, 0.0);
}