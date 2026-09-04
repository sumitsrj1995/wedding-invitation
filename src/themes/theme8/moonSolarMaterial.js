import * as THREE from 'three';

const moonVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormalWorld;

  void main() {
    vUv = uv;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const moonFragmentShader = `
  uniform sampler2D colorMap;
  uniform vec3 sunDirection;
  uniform vec3 surfaceColor;
  uniform vec3 emissiveColor;
  uniform float emissiveIntensity;
  varying vec2 vUv;
  varying vec3 vNormalWorld;

  void main() {
    vec3 normal = normalize(vNormalWorld);
    vec3 lightDir = normalize(sunDirection);
    float sunDot = -dot(normal, lightDir);
    float dayMix = smoothstep(-0.18, 0.82, sunDot);

    vec3 albedo = texture2D(colorMap, vUv).rgb * surfaceColor;
    vec3 ambient = albedo * 0.028;
    vec3 diffuse = albedo * dayMix * 1.35;

    vec3 fillDir = normalize(vec3(-4.0, -1.0, -3.0));
    float fillMix = max(-dot(normal, fillDir), 0.0) * 0.03;
    vec3 fill = albedo * fillMix;

    vec3 emissive = emissiveColor * emissiveIntensity;
    gl_FragColor = vec4(ambient + diffuse + fill + emissive, 1.0);
  }
`;

export function createMoonSolarMaterial({
  colorMap,
  isMobile = false,
  sunDirection,
  emissiveIntensity = 0,
  emissiveColor = '#000000'
}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      colorMap: { value: colorMap },
      sunDirection: { value: sunDirection.clone() },
      surfaceColor: {
        value: new THREE.Color(isMobile ? '#c4c0b8' : '#b8b4ae')
      },
      emissiveColor: { value: new THREE.Color(emissiveColor) },
      emissiveIntensity: { value: emissiveIntensity }
    },
    vertexShader: moonVertexShader,
    fragmentShader: moonFragmentShader
  });
}
