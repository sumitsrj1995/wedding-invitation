import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  CELESTIAL_DISTANCE,
  getVisiblePlanets,
  horizontalToDirection
} from './planetVisibility';

const directionScratch = new THREE.Vector3();
const UPDATE_INTERVAL_SEC = 30;

function PlanetBody({ planet, isMobile }) {
  const position = useMemo(() => {
    horizontalToDirection(planet.azimuth, planet.altitude, directionScratch);
    return directionScratch.clone().multiplyScalar(CELESTIAL_DISTANCE);
  }, [planet.altitude, planet.azimuth]);

  const glowRadius = planet.radius * 2.6;

  return (
    <group position={position}>
      <mesh scale={glowRadius}>
        <sphereGeometry args={[1, 14, 14]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[planet.radius, isMobile ? 14 : 18, isMobile ? 14 : 18]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={0.28 + Math.max(0, -planet.magnitude) * 0.04}
          roughness={0.92}
          metalness={0.03}
        />
      </mesh>

      {planet.ring ? (
        <mesh rotation={[Math.PI / 2.35, 0.35, 0]}>
          <ringGeometry args={[planet.radius * 1.34, planet.radius * 2.02, 40]} />
          <meshStandardMaterial
            color="#c8bc98"
            emissive="#8a8068"
            emissiveIntensity={0.08}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ) : null}
    </group>
  );
}

export default function Planets({ isMobile = false }) {
  const [planets, setPlanets] = useState(() => getVisiblePlanets(new Date()));
  const elapsedRef = useRef(0);

  useLayoutEffect(() => {
    setPlanets(getVisiblePlanets(new Date()));
  }, []);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    if (elapsedRef.current < UPDATE_INTERVAL_SEC) return;
    elapsedRef.current = 0;
    setPlanets(getVisiblePlanets(new Date()));
  });

  if (!planets.length) return null;

  return (
    <group name="pune-visible-planets">
      {planets.map((planet) => (
        <PlanetBody key={planet.key} planet={planet} isMobile={isMobile} />
      ))}
    </group>
  );
}
