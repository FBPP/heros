varying vec3 vColor;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 color = vColor;

  float strength = distance(uv, vec2(0.5)); // [0, sqrt(2) / 2]
  strength *= 2.0; // [0, sqrt(2)]
  strength = 1.0 - strength; // [1, 1 - sqrt(2)]
  gl_FragColor = vec4(strength * color, 1.0);
}