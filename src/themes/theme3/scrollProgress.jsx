import { createContext, useContext, useEffect, useRef } from 'react';

const ScrollProgressContext = createContext(null);

export function ScrollProgressProvider({ children }) {
  const progressRef = useRef(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = scrollable > 0 ? window.scrollY / scrollable : 0;
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <ScrollProgressContext.Provider value={progressRef}>{children}</ScrollProgressContext.Provider>
  );
}

export function useScrollProgressRef() {
  return useContext(ScrollProgressContext);
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

export function sampleCameraPath(progress, keyframes) {
  const t = clamp01(progress) * (keyframes.length - 1);
  const index = Math.floor(t);
  const nextIndex = Math.min(index + 1, keyframes.length - 1);
  const localT = t - index;
  const current = keyframes[index];
  const next = keyframes[nextIndex];
  const eased = localT * localT * (3 - 2 * localT);

  return {
    position: [
      current.position[0] + (next.position[0] - current.position[0]) * eased,
      current.position[1] + (next.position[1] - current.position[1]) * eased,
      current.position[2] + (next.position[2] - current.position[2]) * eased
    ],
    lookAt: [
      current.lookAt[0] + (next.lookAt[0] - current.lookAt[0]) * eased,
      current.lookAt[1] + (next.lookAt[1] - current.lookAt[1]) * eased,
      current.lookAt[2] + (next.lookAt[2] - current.lookAt[2]) * eased
    ]
  };
}
