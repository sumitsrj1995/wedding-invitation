import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

function MilkyWayBand() {
  const material = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(8, 10, 24, 0)');
    gradient.addColorStop(0.35, 'rgba(40, 48, 92, 0.08)');
    gradient.addColorStop(0.52, 'rgba(120, 110, 180, 0.16)');
    gradient.addColorStop(0.68, 'rgba(180, 140, 210, 0.1)');
    gradient.addColorStop(1, 'rgba(8, 10, 24, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  return (
    <mesh rotation={[1.1, 0.4, 0.2]} position={[0, 0, -18]} scale={[42, 18, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={material} transparent opacity={0.55} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function DistantPlanet({ position, color, size }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.04;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

export default function SpaceEnvironment({ isMobile = false, reducedMotion = false }) {
  const starCount = isMobile ? 1800 : 4200;

  return (
    <>
      <color attach="background" args={['#010208']} />
      <fog attach="fog" args={['#010208', 14, 34]} />

      <Stars radius={120} depth={60} count={starCount} factor={3.4} saturation={0} fade speed={reducedMotion ? 0 : 0.12} />
      <Stars radius={160} depth={90} count={Math.floor(starCount * 0.35)} factor={2} saturation={0} fade speed={0} />

      <MilkyWayBand />

      <Sparkles
        count={isMobile ? 24 : 48}
        scale={[18, 14, 12]}
        size={isMobile ? 1.2 : 1.8}
        speed={reducedMotion ? 0 : 0.08}
        opacity={0.22}
        color="#d8e8ff"
      />

      <DistantPlanet position={[-11, 2.5, -16]} color="#8a7898" size={0.35} />
      <DistantPlanet position={[12, -1.5, -18]} color="#6a88b0" size={0.28} />
      <DistantPlanet position={[4, 5, -22]} color="#b89070" size={0.22} />
    </>
  );
}
