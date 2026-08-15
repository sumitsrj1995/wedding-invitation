import { createContext, useContext, useEffect, useRef } from 'react';

const ScrollParallaxContext = createContext(null);

export function ScrollParallaxProvider({ children }) {
  const scrollRef = useRef(0);

  useEffect(() => {
    const updateScroll = () => {
      scrollRef.current = window.scrollY;
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <ScrollParallaxContext.Provider value={scrollRef}>{children}</ScrollParallaxContext.Provider>
  );
}

export function useScrollParallaxRef() {
  return useContext(ScrollParallaxContext);
}
