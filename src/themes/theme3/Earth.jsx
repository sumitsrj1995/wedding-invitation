import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const textureBase = `${import.meta.env.BASE_URL}textures/theme3/`;

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPositionW;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vPositionW = worldPosition.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D specularMap;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPositionW;

  void main() {
    vec3 normal = normalize(vNormalW);
    vec3 dayColor = texture2D(dayMap, vUv).rgb;
    vec3 nightColor = texture2D(nightMap, vUv).rgb * 1.45;
    float sunDot = dot(normal, normalize(sunDirection));
    float dayMix = smoothstep(-0.22, 0.34, sunDot);
    vec3 color = mix(nightColor, dayColor, dayMix);

    float specMask = texture2D(specularMap, vUv).r;
    vec3 viewDir = normalize(cameraPosition - vPositionW);
    vec3 lightDir = normalize(sunDirection);
    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 32.0) * specMask * 0.42;
    color += vec3(specular);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const atmosphereVertexShader = `
  varying vec3 vNormalW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormalW;
  void main() {
    vec3 viewDir = normalize(cameraPosition);
    float rim = 1.0 - max(dot(vNormalW, viewDir), 0.0);
    float intensity = pow(rim, 2.35);
    vec3 atmosphere = vec3(0.42, 0.62, 1.0) * intensity;
    gl_FragColor = vec4(atmosphere, intensity * 0.72);
  }
`;

export default function Earth({ radius = 1.65, reducedMotion = false, isMobile = false }) {
  const earthGroupRef = useRef(null);
  const cloudsRef = useRef(null);
  const segments = isMobile ? 48 : 72;

  const [dayMap, nightMap, specularMap, cloudsMap] = useTexture([
    `${textureBase}earth_day.jpg`,
    `${textureBase}earth_lights.png`,
    `${textureBase}earth_specular.jpg`,
    `${textureBase}earth_clouds.png`
  ]);

  useEffect(() => {
    [dayMap, nightMap, specularMap, cloudsMap].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = isMobile ? 4 : 8;
    });
    cloudsMap.anisotropy = isMobile ? 2 : 4;
  }, [cloudsMap, dayMap, isMobile, nightMap, specularMap]);

  const earthUniforms = useMemo(
    () => ({
      dayMap: { value: dayMap },
      nightMap: { value: nightMap },
      specularMap: { value: specularMap },
      sunDirection: { value: new THREE.Vector3(5, 2, 3).normalize() }
    }),
    [dayMap, nightMap, specularMap]
  );

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.018;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.024;
    }
  });

  return (
    <group ref={earthGroupRef}>
      <mesh>
        <sphereGeometry args={[radius, segments, segments]} />
        <shaderMaterial
          uniforms={earthUniforms}
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={1.006}>
        <sphereGeometry args={[radius, segments, segments]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.34}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      <mesh scale={1.045}>
        <sphereGeometry args={[radius, isMobile ? 32 : 48, isMobile ? 32 : 48]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
