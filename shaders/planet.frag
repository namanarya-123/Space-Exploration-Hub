uniform float uTime;
uniform vec3 uBaseColor;
uniform vec3 uAtmosphereColor;
uniform float uAtmosphereIntensity;
uniform vec3 uLightDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Noise functions
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n = p.x + p.y * 157.0 + 113.0 * p.z;
  return mix(
    mix(mix(hash(n), hash(n + 1.0), f.x),
        mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
    mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
        mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  // Diffuse lighting
  vec3 lightDir = normalize(uLightDirection);
  float diff = max(dot(vNormal, lightDir), 0.0);
  
  // Fresnel for atmosphere edge glow
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
  
  // Surface texture via noise
  vec3 noiseCoord = vPosition * 2.0 + vec3(uTime * 0.05, 0.0, 0.0);
  float surfaceNoise = fbm(noiseCoord);
  
  // Base color with surface variation
  vec3 color = mix(uBaseColor * 0.7, uBaseColor, surfaceNoise);
  color = mix(color, uBaseColor * 1.3, surfaceNoise * surfaceNoise);
  
  // Apply lighting
  color *= (0.1 + 0.9 * diff);
  
  // Atmosphere rim
  vec3 atmosphere = uAtmosphereColor * fresnel * uAtmosphereIntensity;
  color += atmosphere;
  
  // Night side glow
  float nightGlow = (1.0 - diff) * 0.05;
  color += uAtmosphereColor * nightGlow;
  
  gl_FragColor = vec4(color, 1.0);
}
