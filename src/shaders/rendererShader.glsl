precision highp float;

uniform sampler2D data;
uniform vec2 worldSize;

vec4 getData(sampler2D data, vec2 pos) {
  vec4 t = texture2D(data, pos);
  if(t.x > 0.5) t.x = -(t.x - 0.5) * 2.0;
  else t.x = t.x * 2.0;

  if(t.y > 0.5) t.y = -(t.y - 0.5) * 2.0;
  else t.y = t.y * 2.0;

  return t;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 p = gl_FragCoord.xy / worldSize;

  // p.x += sin(p.x / 100.0) * 5.0;
  // p.y += cos(p.y / 100.0) * 5.0;

  vec4 da = getData(data, p);
  vec2 d = da.xy;
  vec3 rgb = hsv2rgb(vec3(da.z, da.w, 0.5));
  float r = 1.0 - length(d) * rgb.x;
  float g = 1.0 - length(d) * rgb.y;
  float b = 1.0 - length(d) * rgb.z;
  gl_FragColor = vec4(r, g, b, 1.0);
}
