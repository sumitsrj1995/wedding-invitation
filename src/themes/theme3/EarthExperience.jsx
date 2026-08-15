import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollProgressProvider } from './scrollProgress';
import EarthScene from './EarthScene';

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

  return (
    <div className="earth-experience" aria-hidden="true">
      <ScrollProgressProvider>
        <Canvas
          camera={{ position: [0.2, 0.35, 6.4], fov: 42, near: 0.1, far: 120 }}
          dpr={isMobile ? [1, 1.2] : [1, 1.5]}
          gl={{
            antialias: !isMobile,
            alpha: false,
            powerPreference: 'high-performance'
          }}
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
