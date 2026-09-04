import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgressRef } from '../theme3/scrollProgress';
import { createMoonSolarMaterial } from './moonSolarMaterial';

const textureBase = `${import.meta.env.BASE_URL}textures/theme5/`;
const EARTH_RADIUS = 1.65;
const MOON_VISIBLE_FRACTION = 0.2;

const MOON_LAYOUT = {
  desktop: {
    radius: EARTH_RADIUS * 0.24,
    orbitRadius: 4.05,
    orbitY: 0.18,
    orbitZ: 0,
    incline: 0.28
  },
  mobile: {
    scrollDrift: 0.05,
    depthOffset: 0.65
  }
};

const earthCenter = new THREE.Vector3(0, 0, 0);
const cameraRight = new THREE.Vector3();
const cameraUp = new THREE.Vector3();
const cameraForward = new THREE.Vector3();
const mobileAnchor = new THREE.Vector3();
const mobileScale = new THREE.Vector3();

export default function Moon({ isMobile = false, reducedMotion = false, sunDirectionRef }) {
  const desktopLayout = MOON_LAYOUT.desktop;
  const mobileLayout = MOON_LAYOUT.mobile;

  const orbitRef = useRef(null);
  const moonRef = useRef(null);
  const mobileGroupRef = useRef(null);
  const progressRef = useScrollProgressRef();
  const dampedAngle = useRef(0);
  const mobileRadiusRef = useRef(EARTH_RADIUS * 0.5);
  const sunDirectionUniform = useRef(new THREE.Vector3(1, 0, 0));

  const [colorMap] = useTexture([`${textureBase}moon_color.jpg`]);

  useEffect(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.anisotropy = isMobile ? 4 : 8;
  }, [colorMap, isMobile]);

  const segments = isMobile ? 32 : 48;

  const moonMaterial = useMemo(
    () =>
      createMoonSolarMaterial({
        colorMap,
        isMobile,
        sunDirection: sunDirectionUniform.current,
        emissiveIntensity: isMobile ? 0.16 : 0,
        emissiveColor: isMobile ? '#3f3c38' : '#000000'
      }),
    [colorMap, isMobile]
  );

  useFrame((state, delta) => {
    if (sunDirectionRef?.current) {
      moonMaterial.uniforms.sunDirection.value.copy(sunDirectionRef.current);
    }

    if (!moonRef.current || !progressRef) return;

    const progress = progressRef.current;

    if (isMobile && mobileGroupRef.current) {
      const { camera } = state;
      const drift = Math.sin(progress * Math.PI * 2) * mobileLayout.scrollDrift;

      camera.updateMatrixWorld();
      camera.matrixWorld.extractBasis(cameraRight, cameraUp, cameraForward);

      const distance = camera.position.distanceTo(earthCenter);
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const frustumHeight = 2 * Math.tan(vFov / 2) * distance;
      const frustumWidth = frustumHeight * camera.aspect;

      const chordFactor = 2 * Math.sqrt(MOON_VISIBLE_FRACTION * (2 - MOON_VISIBLE_FRACTION));
      const moonRadius = frustumWidth / chordFactor;
      mobileRadiusRef.current = moonRadius;

      const bandTop = -frustumHeight * 0.3 + drift * 0.04;
      const moonCenterUp = bandTop - moonRadius;

      mobileAnchor
        .copy(earthCenter)
        .add(cameraUp.clone().multiplyScalar(moonCenterUp))
        .add(cameraForward.clone().multiplyScalar(mobileLayout.depthOffset));

      mobileGroupRef.current.position.copy(mobileAnchor);
      mobileScale.setScalar(moonRadius);
      moonRef.current.scale.copy(mobileScale);
      moonRef.current.rotation.y += delta * (reducedMotion ? 0.012 : 0.035);
      moonRef.current.rotation.x = 0.08 + drift * 0.04;
      moonRef.current.rotation.z = drift * 0.02;
      return;
    }

    if (!orbitRef.current) return;

    const targetAngle = state.clock.elapsedTime * 0.055 + progress * Math.PI * 1.45;

    dampedAngle.current = reducedMotion
      ? targetAngle
      : THREE.MathUtils.damp(dampedAngle.current, targetAngle, 2.4, delta);

    orbitRef.current.rotation.y = dampedAngle.current;
    orbitRef.current.rotation.x = desktopLayout.incline;
    moonRef.current.rotation.y = -dampedAngle.current;
    moonRef.current.scale.setScalar(1);
  });

  const moonMesh = (
    <mesh
      ref={moonRef}
      material={moonMaterial}
      castShadow={!isMobile}
      receiveShadow
      renderOrder={isMobile ? 1 : 0}
    >
      <sphereGeometry args={[1, segments, segments]} />
    </mesh>
  );

  if (isMobile) {
    return <group ref={mobileGroupRef}>{moonMesh}</group>;
  }

  return (
    <group ref={orbitRef}>
      <group position={[desktopLayout.orbitRadius, desktopLayout.orbitY, desktopLayout.orbitZ]}>
        <mesh
          ref={moonRef}
          material={moonMaterial}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[desktopLayout.radius, segments, segments]} />
        </mesh>
      </group>
    </group>
  );
}
