import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgressRef } from '../theme3/scrollProgress';

const textureBase = `${import.meta.env.BASE_URL}textures/theme5/`;
const EARTH_RADIUS = 1.65;
const MOON_RADIUS = EARTH_RADIUS * 0.24;
const ORBIT_RADIUS = 4.05;
const ORBIT_INCLINE = 0.28;

export default function Moon({ isMobile = false, reducedMotion = false }) {
  const orbitRef = useRef(null);
  const moonRef = useRef(null);
  const progressRef = useScrollProgressRef();
  const dampedAngle = useRef(0);

  const [colorMap] = useTexture([`${textureBase}moon_color.jpg`]);

  useEffect(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.anisotropy = isMobile ? 4 : 8;
  }, [colorMap, isMobile]);

  const segments = isMobile ? 32 : 48;

  const moonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: colorMap,
        bumpMap: colorMap,
        bumpScale: isMobile ? 0.008 : 0.012,
        roughness: 0.94,
        metalness: 0.015,
        color: new THREE.Color('#b8b4ae')
      }),
    [colorMap, isMobile]
  );

  useFrame((state, delta) => {
    if (!orbitRef.current || !moonRef.current || !progressRef) return;

    const progress = progressRef.current;
    const targetAngle = state.clock.elapsedTime * 0.055 + progress * Math.PI * 1.45;

    dampedAngle.current = reducedMotion
      ? targetAngle
      : THREE.MathUtils.damp(dampedAngle.current, targetAngle, 2.4, delta);

    orbitRef.current.rotation.y = dampedAngle.current;
    orbitRef.current.rotation.x = ORBIT_INCLINE;
    moonRef.current.rotation.y = -dampedAngle.current;
  });

  return (
    <group ref={orbitRef}>
      <group position={[ORBIT_RADIUS, 0.18, 0]}>
        <mesh ref={moonRef} material={moonMaterial} castShadow receiveShadow>
          <sphereGeometry args={[MOON_RADIUS, segments, segments]} />
        </mesh>
      </group>
    </group>
  );
}
