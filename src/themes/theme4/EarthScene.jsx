import { Suspense } from 'react';
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing';
import Earth from '../theme3/Earth';
import SpaceEnvironment from '../theme3/SpaceEnvironment';
import ScrollCameraRig from './ScrollCameraRig';

function ScenePostProcessing({ enabled }) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.32} luminanceThreshold={0.22} luminanceSmoothing={0.85} mipmapBlur />
      <DepthOfField focusDistance={0.012} focalLength={0.045} bokehScale={1.6} height={540} />
      <Vignette eskil offset={0.14} darkness={0.72} />
    </EffectComposer>
  );
}

export default function EarthScene({ isMobile = false, reducedMotion = false }) {
  return (
    <>
      <SpaceEnvironment isMobile={isMobile} reducedMotion={reducedMotion} />

      <ambientLight intensity={0.08} color="#88a0d0" />
      <directionalLight position={[6, 2.5, 4]} intensity={2.1} color="#fff8ee" />
      <directionalLight position={[-4, -1, -3]} intensity={0.18} color="#6a80c0" />
      <pointLight position={[0, 0, 2]} intensity={0.12} color="#ffd8f0" distance={20} />

      <Suspense fallback={null}>
        <Earth isMobile={isMobile} reducedMotion={reducedMotion} />
      </Suspense>

      <ScrollCameraRig isMobile={isMobile} reducedMotion={reducedMotion} />
      <ScenePostProcessing enabled={!isMobile} />
    </>
  );
}
