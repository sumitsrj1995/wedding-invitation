import { Suspense, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing';
import SpaceEnvironment from './SpaceEnvironment';
import Earth, { INITIAL_EARTH_Y } from './Earth';
import Moon from './Moon';
import Planets from './Planets';
import ScrollCameraRig from './ScrollCameraRig';
import { getCurrentISTDate, getSunDirectionECEF } from './solarPosition';

const initialSun = new THREE.Vector3();
const initialSunWorld = new THREE.Vector3();
const earthDisplayRotation = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(0, 1, 0),
  INITIAL_EARTH_Y
);

function ScenePostProcessing({ isMobile = false }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.38} luminanceThreshold={0.12} luminanceSmoothing={0.72} mipmapBlur />
      {!isMobile ? (
        <DepthOfField focusDistance={0.012} focalLength={0.045} bokehScale={1.6} height={540} />
      ) : null}
      <Vignette eskil offset={0.14} darkness={0.72} />
    </EffectComposer>
  );
}

export default function EarthScene({ isMobile = false, reducedMotion = false }) {
  const sunLightRef = useRef(null);

  useLayoutEffect(() => {
    if (!sunLightRef.current) return;
    getSunDirectionECEF(getCurrentISTDate(), initialSun);
    initialSunWorld.copy(initialSun).applyQuaternion(earthDisplayRotation);
    sunLightRef.current.position.copy(initialSunWorld).multiplyScalar(14);
    sunLightRef.current.target.position.set(0, 0, 0);
    sunLightRef.current.target.updateMatrixWorld();
  }, []);

  const handleSunDirectionChange = (sunDirection) => {
    if (!sunLightRef.current) return;
    sunLightRef.current.position.copy(sunDirection).multiplyScalar(14);
    sunLightRef.current.target.position.set(0, 0, 0);
    sunLightRef.current.target.updateMatrixWorld();
  };

  return (
    <>
      <SpaceEnvironment isMobile={isMobile} reducedMotion={reducedMotion} />

      <ambientLight intensity={0.028} color="#6078a8" />
      <directionalLight
        ref={sunLightRef}
        position={[6, 2.5, 4]}
        intensity={1.35}
        color="#fff8ee"
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={24}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, -1, -3]} intensity={0.03} color="#506090" />

      <Suspense fallback={null}>
        <Earth
          isMobile={isMobile}
          reducedMotion={reducedMotion}
          onSunDirectionChange={handleSunDirectionChange}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Moon isMobile={isMobile} reducedMotion={reducedMotion} />
      </Suspense>

      <Suspense fallback={null}>
        <Planets isMobile={isMobile} />
      </Suspense>

      <ScrollCameraRig isMobile={isMobile} reducedMotion={reducedMotion} />
      <ScenePostProcessing isMobile={isMobile} />
    </>
  );
}
