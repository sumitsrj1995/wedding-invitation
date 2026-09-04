import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getCurrentISTDate, getSunDirectionEarthModel, getSunDirectionInertial } from './solarPosition';
import { useScrollProgressRef } from '../theme3/scrollProgress';

const textureBase = `${import.meta.env.BASE_URL}textures/theme3/`;
/** Orient geography so India/Asia faces the default camera (NASA texture seam vs sphere UV). */
export const INITIAL_EARTH_Y = Math.PI;
const CLOUD_DRIFT_OFFSET = 0.02;

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormalGeo;
  varying vec3 vPositionW;

  void main() {
    vUv = uv;
    vNormalGeo = normalize(normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vPositionW = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D specularMap;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormalGeo;
  varying vec3 vPositionW;

  void main() {
    vec3 normal = normalize(vNormalGeo);
    vec3 dayColor = texture2D(dayMap, vUv).rgb;
    vec3 lightDir = normalize(sunDirection);

    float sunDot = -dot(normal, lightDir);
    float dayMix = smoothstep(-0.28, 0.28, sunDot);
    float twilight = smoothstep(-0.2, 0.04, sunDot) * (1.0 - smoothstep(0.0, 0.28, sunDot));
    float nightMix = 1.0 - dayMix;

    vec3 lightsRaw = texture2D(nightMap, vUv).rgb;
    float lightLuma = dot(lightsRaw, vec3(0.299, 0.587, 0.114));

    // Preserve geographic distribution; suppress noise and faint scatter.
    float density = smoothstep(0.04, 0.17, lightLuma);

    // Irregular intensity: dim haze in rural areas, slightly stronger urban cores.
    float softSpread = pow(clamp(lightLuma, 0.0, 1.0), 1.72);
    float urbanCore = smoothstep(0.24, 0.68, lightLuma);
    float lightStrength = density * mix(softSpread * 0.34, softSpread * 0.88, urbanCore);

    // Warm amber/yellow with subtle variation from the source texture.
    float warmth = clamp(lightsRaw.r * 0.92 + lightsRaw.g * 0.34, 0.0, 1.0);
    vec3 amberSoft = vec3(0.76, 0.56, 0.33);
    vec3 amberMid = vec3(0.88, 0.69, 0.41);
    vec3 amberCore = vec3(0.94, 0.76, 0.48);
    vec3 amberTone = mix(amberSoft, amberMid, smoothstep(0.1, 0.42, warmth));
    amberTone = mix(amberTone, amberCore, urbanCore * 0.45);

    vec3 cityLights = amberTone * lightStrength;

    // Deep night only; fade toward the terminator and hide on the day side.
    float cityVisibility =
      smoothstep(-0.03, -0.3, sunDot) *
      (1.0 - smoothstep(-0.2, 0.05, sunDot)) *
      (1.0 - dayMix);

    vec3 cityContribution = cityLights * cityVisibility * 0.18;

    // Faint earthshine: preserve terrain/ocean hues at very low luminance (warm-neutral, not blue).
    float nightDepth = smoothstep(-0.02, -0.34, sunDot);
    float ambientLevel = mix(0.024, 0.056, nightDepth);
    float earthLuma = dot(dayColor, vec3(0.299, 0.587, 0.114));
    vec3 mutedEarth = mix(dayColor, vec3(earthLuma * 0.9), 0.14);
    vec3 nightBase = mutedEarth * ambientLevel * vec3(1.0, 0.98, 0.93);
    vec3 nightColor = mix(nightBase, nightBase + cityContribution, density * cityVisibility);

    vec3 color = mix(nightColor, dayColor, dayMix);
    vec3 sunset = dayColor * vec3(1.18, 0.78, 0.48);
    color = mix(color, sunset, twilight * 0.58);

    float specMask = texture2D(specularMap, vUv).r;
    vec3 viewDir = normalize(cameraPosition - vPositionW);
    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 36.0) * specMask * 0.48 * dayMix;
    color += vec3(specular);

    color = mix(color, nightColor, nightMix * (1.0 - smoothstep(-0.18, 0.02, sunDot)) * 0.24);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const atmosphereVertexShader = `
  varying vec3 vNormalW;
  varying vec3 vNormalGeo;
  void main() {
    vNormalGeo = normalize(normal);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 sunDirection;
  varying vec3 vNormalW;
  varying vec3 vNormalGeo;

  void main() {
    vec3 viewDir = normalize(cameraPosition);
    float rim = 1.0 - max(dot(vNormalW, viewDir), 0.0);
    float intensity = pow(rim, 2.15);
    float sunFacing = max(-dot(normalize(vNormalGeo), normalize(sunDirection)), 0.0);
    vec3 dayAtmosphere = vec3(0.48, 0.68, 1.0);
    vec3 nightAtmosphere = vec3(0.08, 0.12, 0.24);
    vec3 atmosphere = mix(nightAtmosphere, dayAtmosphere, smoothstep(0.0, 0.55, sunFacing));
    float alpha = intensity * mix(0.28, 0.78, smoothstep(0.0, 0.45, sunFacing));
    gl_FragColor = vec4(atmosphere * intensity, alpha);
  }
`;

const cloudVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormalGeo;

  void main() {
    vUv = uv;
    vNormalGeo = normalize(normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragmentShader = `
  uniform sampler2D cloudMap;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormalGeo;

  void main() {
    vec4 sample = texture2D(cloudMap, vUv);
    float sunDot = -dot(normalize(vNormalGeo), normalize(sunDirection));
    float dayMix = smoothstep(-0.2, 0.28, sunDot);
    float alpha = sample.a * mix(0.062, 0.32, dayMix);
    vec3 cloudColor = mix(vec3(0.19, 0.18, 0.16), vec3(1.0), dayMix);
    gl_FragColor = vec4(cloudColor, alpha);
  }
`;

export default function Earth({
  radius = 1.65,
  reducedMotion = false,
  isMobile = false,
  onSunDirectionChange
}) {
  const earthGroupRef = useRef(null);
  const cloudsRef = useRef(null);
  const progressRef = useScrollProgressRef();
  const dampedScrollYaw = useRef(0);
  const sunDirectionRef = useRef(getSunDirectionInertial(getCurrentISTDate(), new THREE.Vector3()));
  const sunInertialRef = useRef(new THREE.Vector3());
  const segments = isMobile ? 48 : 72;

  const [dayMap, nightMap, specularMap, cloudsMap] = useTexture([
    `${textureBase}earth_day.jpg`,
    `${textureBase}earth_lights.png`,
    `${textureBase}earth_specular.jpg`,
    `${textureBase}earth_clouds.png`
  ]);

  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: dayMap },
        nightMap: { value: nightMap },
        specularMap: { value: specularMap },
        sunDirection: { value: sunDirectionRef.current.clone() }
      },
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader
    });
  }, [dayMap, nightMap, specularMap]);

  const cloudMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        cloudMap: { value: cloudsMap },
        sunDirection: { value: sunDirectionRef.current.clone() }
      },
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
  }, [cloudsMap]);

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          sunDirection: { value: sunDirectionRef.current.clone() }
        },
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      }),
    []
  );

  const syncSunUniforms = () => {
    getSunDirectionInertial(getCurrentISTDate(), sunInertialRef.current);
    getSunDirectionEarthModel(
      getCurrentISTDate(),
      earthGroupRef.current?.quaternion,
      sunDirectionRef.current,
      sunInertialRef.current
    );
    earthMaterial.uniforms.sunDirection.value.copy(sunDirectionRef.current);
    cloudMaterial.uniforms.sunDirection.value.copy(sunDirectionRef.current);
    atmosphereMaterial.uniforms.sunDirection.value.copy(sunDirectionRef.current);
  };

  useLayoutEffect(() => {
    syncSunUniforms();
  }, [atmosphereMaterial, cloudMaterial, earthMaterial]);

  useEffect(() => {
    [dayMap, nightMap, specularMap, cloudsMap].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = isMobile ? 4 : 8;
    });
    cloudsMap.anisotropy = isMobile ? 2 : 4;

    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y = INITIAL_EARTH_Y;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = CLOUD_DRIFT_OFFSET;
    }
  }, [cloudsMap, dayMap, isMobile, nightMap, specularMap]);

  useFrame((state, delta) => {
    if (isMobile && earthGroupRef.current && progressRef) {
      const progress = progressRef.current;
      const targetYaw = Math.sin(progress * Math.PI) * 0.36;
      dampedScrollYaw.current = reducedMotion
        ? targetYaw
        : THREE.MathUtils.damp(dampedScrollYaw.current, targetYaw, 2.6, delta);

      earthGroupRef.current.rotation.y = INITIAL_EARTH_Y + dampedScrollYaw.current;
      earthGroupRef.current.rotation.x = Math.sin(progress * Math.PI * 2) * 0.045;

      if (cloudsRef.current) {
        const cloudSpin = reducedMotion ? 0 : state.clock.elapsedTime * 0.004;
        cloudsRef.current.rotation.y =
          CLOUD_DRIFT_OFFSET + dampedScrollYaw.current * 0.08 + cloudSpin;
      }
    } else if (!reducedMotion) {
      if (earthGroupRef.current) {
        earthGroupRef.current.rotation.y += delta * 0.018;
      }
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += delta * 0.024;
      }
    }

    syncSunUniforms();

    if (onSunDirectionChange) {
      onSunDirectionChange(sunInertialRef.current);
    }
  });

  return (
    <group ref={earthGroupRef}>
      <mesh>
        <sphereGeometry args={[radius, segments, segments]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      <mesh ref={cloudsRef} scale={1.006}>
        <sphereGeometry args={[radius, segments, segments]} />
        <primitive object={cloudMaterial} attach="material" />
      </mesh>

      <mesh scale={1.045}>
        <sphereGeometry args={[radius, isMobile ? 32 : 48, isMobile ? 32 : 48]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
    </group>
  );
}
