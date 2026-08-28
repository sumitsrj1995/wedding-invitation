import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sampleCameraPath, useScrollProgressRef } from '../theme3/scrollProgress';

const desktopCameraKeyframes = [
  { position: [0.2, 0.35, 6.4], lookAt: [0, 0, 0] },
  { position: [3.8, 0.75, 4.8], lookAt: [0, 0.05, 0] },
  { position: [1.2, 1.15, 3.85], lookAt: [0, 0.08, 0] },
  { position: [-3.6, 0.85, 4.5], lookAt: [0, 0.02, 0] },
  { position: [0.4, 1.55, 6.1], lookAt: [0, 0, 0] }
];

/** Theme7 mobile: stay front-facing — zoom and drift only, never orbit behind Earth. */
const mobileCameraKeyframes = [
  { position: [0.15, 0.35, 8.4], lookAt: [0, 0, 0] },
  { position: [0.22, 0.42, 7.55], lookAt: [0, 0.015, 0] },
  { position: [0.1, 0.52, 6.85], lookAt: [0, 0.03, 0] },
  { position: [-0.08, 0.44, 7.25], lookAt: [0, 0.02, 0] },
  { position: [0.14, 0.4, 8.15], lookAt: [0, 0, 0] }
];

function getCameraKeyframes(isMobile) {
  return isMobile ? mobileCameraKeyframes : desktopCameraKeyframes;
}

const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const currentLookAt = new THREE.Vector3(0, 0, 0);

export default function ScrollCameraRig({ isMobile = false, reducedMotion = false }) {
  const progressRef = useScrollProgressRef();
  const dampedProgress = useRef(0);
  const cameraKeyframes = useRef(getCameraKeyframes(isMobile));

  useFrame((state, delta) => {
    if (!progressRef) return;

    const targetProgress = progressRef.current;
    dampedProgress.current = reducedMotion
      ? targetProgress
      : THREE.MathUtils.damp(dampedProgress.current, targetProgress, 2.8, delta);

    const sample = sampleCameraPath(dampedProgress.current, cameraKeyframes.current);
    targetPosition.set(sample.position[0], sample.position[1], sample.position[2]);
    targetLookAt.set(sample.lookAt[0], sample.lookAt[1], sample.lookAt[2]);

    state.camera.position.lerp(targetPosition, 1 - Math.exp(-3.6 * delta));
    currentLookAt.lerp(targetLookAt, 1 - Math.exp(-3.6 * delta));
    state.camera.lookAt(currentLookAt);
  });

  return null;
}
