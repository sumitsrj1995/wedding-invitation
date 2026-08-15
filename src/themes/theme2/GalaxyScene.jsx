import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import { OrbitingBody, Planet } from './Planet';
import { useScrollParallaxRef } from './scrollParallax';

function NebulaCloud({ position, color, scale, opacity = 0.09 }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function ScrollRig({ reducedMotion }) {
  const scrollRef = useScrollParallaxRef();

  useFrame((state) => {
    if (!scrollRef) return;

    const scroll = scrollRef.current;
    const parallax = reducedMotion ? 0 : scroll * 0.0012;

    state.camera.position.y = parallax;
    state.camera.position.x = reducedMotion ? 0 : Math.sin(parallax * 0.6) * 0.35;
    state.camera.position.z = 8 - parallax * 0.25;
    state.camera.lookAt(0, parallax * 0.45, 0);
  });

  return null;
}

function StarDepthLayer({ count, radius, depth, factor, speed }) {
  return <Stars radius={radius} depth={depth} count={count} factor={factor} saturation={0.15} fade speed={speed} />;
}

export default function GalaxyScene({ isMobile = false, reducedMotion = false }) {
  const groupRef = useRef(null);
  const starCount = isMobile ? 2200 : 5500;
  const sparkleCount = isMobile ? 35 : 70;

  const planets = useMemo(
    () => [
      {
        position: [-7.5, 1.2, -5],
        size: 0.95,
        color: '#c4a8e8',
        emissive: '#6b4f99',
        atmosphereColor: '#dcc8ff',
        ring: true,
        ringColor: '#f0e0c8'
      },
      {
        position: [8, -0.4, -3.5],
        size: 0.72,
        color: '#f2b8d4',
        emissive: '#8a4a68',
        atmosphereColor: '#ffd8ea',
        rotationSpeed: 0.1
      },
      {
        position: [5.5, 3.8, -7],
        size: 0.55,
        color: '#9ec5ff',
        emissive: '#3a5088',
        atmosphereColor: '#c8dcff'
      },
      {
        position: [-6, -3.2, -4],
        size: 0.68,
        color: '#e8c896',
        emissive: '#6a5030',
        atmosphereColor: '#ffe8c8',
        ring: true,
        ringColor: '#fff2dc',
        ringOpacity: 0.32
      },
      {
        position: [0.5, -1.5, -11],
        size: 1.45,
        color: '#7a88c8',
        emissive: '#2a3460',
        emissiveIntensity: 0.12,
        atmosphereColor: '#a8b8ff',
        atmosphereOpacity: 0.18,
        rotationSpeed: 0.04,
        floatSpeed: 0.5,
        floatIntensity: 0.15
      }
    ],
    []
  );

  useFrame(({ clock }) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.015;
  });

  return (
    <>
      <color attach="background" args={['#03040a']} />
      <fog attach="fog" args={['#03040a', 10, 28]} />

      <ambientLight intensity={0.18} color="#dfe8ff" />
      <directionalLight position={[8, 6, 4]} intensity={1.15} color="#fff6e8" />
      <directionalLight position={[-6, -2, -4]} intensity={0.35} color="#c8a0ff" />
      <pointLight position={[0, 0, 2]} intensity={0.25} color="#ffd8f0" distance={18} />

      <ScrollRig reducedMotion={reducedMotion} />

      <group ref={groupRef}>
        <StarDepthLayer count={starCount} radius={90} depth={45} factor={3.8} speed={reducedMotion ? 0 : 0.35} />
        <StarDepthLayer count={Math.floor(starCount * 0.35)} radius={120} depth={70} factor={2.2} speed={reducedMotion ? 0 : 0.15} />

        <NebulaCloud position={[-8, 3, -14]} color="#6b3a88" scale={[7, 5, 4]} opacity={0.1} />
        <NebulaCloud position={[9, -2, -12]} color="#3a2878" scale={[6, 4.5, 3.5]} opacity={0.08} />
        <NebulaCloud position={[0, 5, -16]} color="#8a4070" scale={[8, 5, 4]} opacity={0.07} />
        <NebulaCloud position={[-4, -5, -10]} color="#284878" scale={[5, 4, 3]} opacity={0.06} />

        <Sparkles
          count={sparkleCount}
          scale={[22, 16, 14]}
          size={isMobile ? 1.5 : 2}
          speed={reducedMotion ? 0 : 0.18}
          opacity={0.32}
          color="#fff0fa"
        />

        {planets.map((planet) => (
          <Planet key={`${planet.position.join('-')}-${planet.size}`} {...planet}>
            {planet.position[0] === 8 ? (
              <OrbitingBody radius={1.35} speed={0.45} size={0.12} color="#f8e8ff" tilt={0.4} />
            ) : null}
            {planet.size > 1 ? (
              <>
                <OrbitingBody radius={2.4} speed={0.22} size={0.16} color="#d8c8ff" tilt={0.55} />
                <OrbitingBody radius={3.1} speed={0.16} size={0.1} color="#ffe8f4" tilt={0.35} />
              </>
            ) : null}
          </Planet>
        ))}
      </group>
    </>
  );
}
