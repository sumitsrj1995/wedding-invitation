import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgressRef } from '../theme3/scrollProgress';
import { getCurrentISTDate, getSunDirectionInertial } from './solarPosition';
import { createMoonSolarMaterial } from './moonSolarMaterial';

const textureBase = `${import.meta.env.BASE_URL}textures/theme5/`;
const EARTH_RADIUS = 1.65;
const MOON_RADIUS = EARTH_RADIUS * 0.24;
const ORBIT_RADIUS = 4.05;
const ORBIT_INCLINE = 0.28;

export default function Moon({ isMobile = false, reducedMotion = false, sunDirectionRef }) {
  const orbitRef = useRef(null);
  const moonRef = useRef(null);
  const progressRef = useScrollProgressRef();
  const dampedAngle = useRef(0);
  const sunDirectionUniform = useRef(getSunDirectionInertial(getCurrentISTDate(), new THREE.Vector3()));

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
        sunDirection: sunDirectionUniform.current
      }),
    [colorMap, isMobile]
  );

  useFrame((state, delta) => {
    if (sunDirectionRef?.current) {
      moonMaterial.uniforms.sunDirection.value.copy(sunDirectionRef.current);
    } else {
      getSunDirectionInertial(getCurrentISTDate(), moonMaterial.uniforms.sunDirection.value);
    }

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
