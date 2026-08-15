import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import GalaxyScene from './GalaxyScene';
import { ScrollParallaxProvider } from './scrollParallax';

export default function GalaxyBackground() {
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
    <div className="galaxy-background" aria-hidden="true">
      <ScrollParallaxProvider>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 58, near: 0.1, far: 100 }}
          dpr={isMobile ? [1, 1.25] : [1, 1.5]}
          gl={{
            antialias: !isMobile,
            alpha: false,
            powerPreference: 'high-performance'
          }}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <GalaxyScene isMobile={isMobile} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </ScrollParallaxProvider>
    </div>
  );
}
