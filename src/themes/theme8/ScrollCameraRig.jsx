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

function getCameraKeyframes(isMobile) {
  if (!isMobile) return desktopCameraKeyframes;

  return desktopCameraKeyframes.map(({ position, lookAt }) => ({
    position: [position[0] * 0.76, position[1], position[2] * 1.34],
    lookAt: [...lookAt]
  }));
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
