uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5, 0.5);
  vec2 delta = uv - center;
  float dist = length(delta);
  
  // Event horizon radius
  float eventHorizon = 0.08;
  float photonSphere = 0.12;
  float lensRadius = 0.35;
  
  // Gravitational lensing
  if (dist > eventHorizon && dist < lensRadius) {
    float lensStrength = pow((lensRadius - dist) / lensRadius, 2.0) * 0.3;
    vec2 lensedUv = uv + normalize(delta) * (-lensStrength) * (eventHorizon / dist);
    uv = lensedUv;
  }
  
  // Accretion disk
  float diskInner = photonSphere * 1.1;
  float diskOuter = photonSphere * 3.5;
  float diskAngle = atan(delta.y, delta.x);
  
  // Apply disk coloring
  vec3 color = vec3(0.0);
  
  if (dist > diskInner && dist < diskOuter) {
    float diskFactor = (dist - diskInner) / (diskOuter - diskInner);
    float angle = diskAngle + uTime * 0.3;
    
    // Doppler boosting — brighter on approaching side
    float doppler = 0.5 + 0.5 * sin(angle);
    
    vec3 hotColor = vec3(1.0, 0.9, 0.4);
    vec3 coolColor = vec3(0.6, 0.1, 0.8);
    vec3 diskColor = mix(hotColor, coolColor, diskFactor);
    
    float diskAlpha = (1.0 - diskFactor) * 0.8 * doppler;
    diskAlpha *= smoothstep(diskInner, diskInner + 0.02, dist);
    diskAlpha *= smoothstep(diskOuter, diskOuter - 0.02, dist);
    
    color += diskColor * diskAlpha;
  }
  
  // Black void at event horizon
  if (dist < eventHorizon) {
    color = vec3(0.0);
  }
  
  // Outer glow
  if (dist > eventHorizon) {
    float glowFactor = 1.0 - smoothstep(eventHorizon, lensRadius * 0.8, dist);
    color += vec3(0.3, 0.0, 0.6) * glowFactor * 0.3;
  }
  
  gl_FragColor = vec4(color, 1.0);
}
