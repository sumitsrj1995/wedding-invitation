import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export function Planet({
  position,
  size,
  color,
  emissive = '#000000',
  emissiveIntensity = 0.08,
  rotationSpeed = 0.08,
  atmosphereColor = '#c8d8ff',
  atmosphereOpacity = 0.14,
  ring = false,
  ringColor = '#e8d4b8',
  ringOpacity = 0.42,
  floatSpeed = 1,
  floatIntensity = 0.35,
  children
}) {
  const planetRef = useRef(null);

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.15} floatIntensity={floatIntensity}>
      <group position={position}>
        <group ref={planetRef}>
          <mesh>
            <sphereGeometry args={[size, isLowPoly(size), isLowPoly(size)]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
              roughness={0.82}
              metalness={0.12}
            />
          </mesh>
          <mesh scale={1.08}>
            <sphereGeometry args={[size, 24, 24]} />
            <meshBasicMaterial
              color={atmosphereColor}
              transparent
              opacity={atmosphereOpacity}
              depthWrite={false}
              side={THREE.BackSide}
            />
          </mesh>
          {ring ? (
            <mesh rotation={[Math.PI / 2.15, 0.2, 0.1]}>
              <ringGeometry args={[size * 1.35, size * 1.85, 64]} />
              <meshStandardMaterial
                color={ringColor}
                transparent
                opacity={ringOpacity}
                side={THREE.DoubleSide}
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
          ) : null}
        </group>
        {children}
      </group>
    </Float>
  );
}

export function OrbitingBody({ radius, speed, size, color, tilt = 0 }) {
  const orbitRef = useRef(null);

  useFrame(({ clock }) => {
    if (!orbitRef.current) return;
    const time = clock.getElapsedTime() * speed;
    orbitRef.current.position.x = Math.cos(time) * radius;
    orbitRef.current.position.z = Math.sin(time) * radius;
    orbitRef.current.position.y = Math.sin(time * 0.7) * radius * 0.12;
  });

  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh ref={orbitRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.75} metalness={0.08} emissive={color} emissiveIntensity={0.06} />
      </mesh>
    </group>
  );
}

function isLowPoly(size) {
  return size > 1.2 ? 48 : 32;
}
