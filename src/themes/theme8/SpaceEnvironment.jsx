import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Theme6 space backdrop — stars stay beyond Earth so none sit between camera and planet.
 * Theme3 SpaceEnvironment is left unchanged for themes 3–5.
 */

function FarStars({ count, radius, spread, size = 0.55 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const spherical = new THREE.Spherical();
    const vector = new THREE.Vector3();

    for (let i = 0; i < count; i += 1) {
      // Keep every star outside the near Earth/camera volume.
      const r = radius + Math.random() * spread;
      spherical.set(r, Math.acos(1 - Math.random() * 2), Math.random() * Math.PI * 2);
      vector.setFromSpherical(spherical);
      arr[i * 3] = vector.x;
      arr[i * 3 + 1] = vector.y;
      arr[i * 3 + 2] = vector.z;
    }

    return arr;
  }, [count, radius, spread]);

  return (
    <points frustumCulled={false} renderOrder={-20}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#dce6f4"
        size={size}
        sizeAttenuation
        transparent
        opacity={0.78}
        depthWrite={false}
        depthTest
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

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
    <mesh rotation={[1.1, 0.4, 0.2]} position={[0, 0, -28]} scale={[48, 20, 1]} renderOrder={-25}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={material}
        transparent
        opacity={0.55}
        depthWrite={false}
        depthTest
        side={THREE.DoubleSide}
      />
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
    <mesh ref={ref} position={position} renderOrder={-15}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.08}
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  );
}

export default function SpaceEnvironment({ isMobile = false }) {
  const starCount = isMobile ? 1600 : 3800;

  return (
    <>
      <color attach="background" args={['#010208']} />
      <fog attach="fog" args={['#010208', 16, 42]} />

      {/* Minimum radius well beyond Earth + camera path (~8 units). */}
      <FarStars count={starCount} radius={72} spread={48} size={isMobile ? 0.48 : 0.58} />
      <FarStars
        count={Math.floor(starCount * 0.32)}
        radius={110}
        spread={60}
        size={isMobile ? 0.32 : 0.4}
      />

      <MilkyWayBand />

      <DistantPlanet position={[-14, 3.2, -28]} color="#8a7898" size={0.35} />
      <DistantPlanet position={[16, -2.2, -32]} color="#6a88b0" size={0.28} />
      <DistantPlanet position={[5, 6.5, -36]} color="#b89070" size={0.22} />
    </>
  );
}
