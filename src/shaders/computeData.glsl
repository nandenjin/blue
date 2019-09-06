precision highp float;

#define PI 3.1415

uniform vec2 pointerPos;
uniform vec2 worldSize;
uniform float cursorSize;
uniform float color;
uniform float speed;
uniform float direction;
uniform float saturation;
uniform sampler2D data;

vec4 getData(sampler2D data, vec2 pos) {
  if(pos.x < 0.0 || 1.0 < pos.x || pos.y < 0.0 || 1.0 < pos.y) return vec4(0.0, 0.0, 0.0, 0.0);

  vec4 t = texture2D(data, pos);
  if(t.x > 0.5) t.x = -(t.x - 0.5) * 2.0;
  else t.x = t.x * 2.0;

  if(t.y > 0.5) t.y = -(t.y - 0.5) * 2.0;
  else t.y = t.y * 2.0;

  return t;
}

vec2 toSaveData(vec2 data) {
  vec2 result;
  if (data.x >= 0.0) result.x = data.x / 2.0;
  else result.x = -data.x / 2.0 + 0.5;

  if (data.y >= 0.0) result.y = data.y / 2.0;
  else result.y = -data.y / 2.0 + 0.5;

  return result;
}

void main() {

  vec2 pos = gl_FragCoord.xy;
  vec2 posTex = pos / worldSize + vec2(cos(direction * PI * 2.0), sin(direction * PI * 2.0)) * 0.01 * speed;
  vec4 va = getData(data, posTex);
  vec2 v = va.xy;
  float power = 0.3;

  vec2 mPos = vec2(pointerPos.x / worldSize.x, 1.0 - pointerPos.y / worldSize.y) * worldSize;
  vec2 powerFromPointer = normalize(pos - mPos) * (1.0 - min(max(length(pos - mPos) / cursorSize, 0.0), 1.0));

  if (length(powerFromPointer) > 0.0) {
    va.z = color;
    va.w = saturation;
  }

  v += powerFromPointer;

  vec2 offsetX = vec2(1.0, 0.0);
  vec2 offsetY = vec2(0.0, 1.0);

  v += getData(data, posTex + offsetX).xy * power;
  v += getData(data, posTex - offsetX).xy * power;
  v += getData(data, posTex + offsetY).xy * power;
  v += getData(data, posTex - offsetY).xy * power;
  v += getData(data, posTex + offsetX + offsetY).xy * power;
  v += getData(data, posTex + offsetX - offsetY).xy * power;
  v += getData(data, posTex - offsetX + offsetY).xy * power;
  v += getData(data, posTex - offsetX - offsetY).xy * power;

  if(length(v) > 0.01) v *= 0.99;
  
  gl_FragColor = vec4(toSaveData(v), va.zw);
}
