import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollProgressProvider } from '../theme3/scrollProgress';
import EarthScene from './EarthScene';

const desktopCamera = { position: [0.2, 0.35, 6.4], fov: 42, near: 0.1, far: 120 };
const mobileCamera = { position: [0.15, 0.35, 8.4], fov: 54, near: 0.1, far: 120 };

export default function EarthExperience() {
  const { isMobile, reducedMotion } = useMemo(() => {
    if (typeof window === 'undefined') {
      return { isMobile: false, reducedMotion: false };
    }

    return {
      isMobile: window.matchMedia('(max-width: 767px)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  }, []);

  const camera = isMobile ? mobileCamera : desktopCamera;

  return (
    <div className="earth-experience" aria-hidden="true">
      <ScrollProgressProvider>
        <Canvas
          camera={camera}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
          }}
          shadows={!isMobile}
          performance={{ min: 0.55 }}
        >
          <Suspense fallback={null}>
            <EarthScene isMobile={isMobile} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </ScrollProgressProvider>
    </div>
  );
}
