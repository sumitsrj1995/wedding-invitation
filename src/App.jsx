import { useCallback, useEffect, useRef, useState } from 'react';
import Envelope from './components/Envelope';
import Hero from './components/Hero';
import EventDetails from './components/EventDetails';
import Countdown from './components/Countdown';
import Schedule from './components/Schedule';
import Gallery from './components/Gallery';
import PresenceMessage from './components/DressCode';
import Footer from './components/Footer';
import { content } from './utils/content';

export default function App() {
  const sectionRefs = useRef([]);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    const storedValue = window.localStorage.getItem('celebration-sound');
    return storedValue === null ? true : storedValue !== 'muted';
  });
  const eventDetailsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('celebration-sound', soundEnabled ? 'on' : 'muted');
    }
  }, [soundEnabled]);

  const handleEnvelopeOpen = useCallback(() => {
    setIsEnvelopeOpen(true);
  }, []);

  useEffect(() => {
    if (!isEnvelopeOpen) return;

    const revealTimer = window.setTimeout(() => {
      eventDetailsRef.current?.classList.add('revealed');
      sectionRefs.current.forEach((node) => node?.classList.add('revealed'));
    }, 120);

    return () => window.clearTimeout(revealTimer);
  }, [isEnvelopeOpen]);

  return (
    <main style={{ position: 'relative' }}>
      <button
        type="button"
        className="sound-toggle"
        onClick={() => setSoundEnabled((current) => !current)}
        aria-pressed={!soundEnabled}
        aria-label={soundEnabled ? 'Mute celebration sound' : 'Enable celebration sound'}
      >
        {soundEnabled ? '🔊' : '🔈'}
      </button>

      <Envelope names={content.couple.names} isOpen={isEnvelopeOpen} onOpen={handleEnvelopeOpen} soundEnabled={soundEnabled}>
        <Hero couple={content.couple} />
      </Envelope>

      {isEnvelopeOpen && (
        <>
          <div ref={eventDetailsRef} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 500ms ease', paddingTop: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <EventDetails couple={content.couple} />
          </div>
          <div ref={(node) => (sectionRefs.current[0] = node)} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 500ms ease' }}>
            <Countdown date="2026-12-13T16:00:00" />
          </div>
          <div ref={(node) => (sectionRefs.current[1] = node)} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 500ms ease' }}>
            <Schedule schedule={content.schedule} />
          </div>
          <div ref={(node) => (sectionRefs.current[2] = node)} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 500ms ease' }}>
            <Gallery images={content.gallery} />
          </div>
          <div ref={(node) => (sectionRefs.current[3] = node)} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 500ms ease' }}>
            <PresenceMessage />
          </div>

          <Footer couple={content.couple} />
        </>
      )}
      <style>{`
        .revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .sound-toggle {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1000;
          border: 1px solid rgba(184, 147, 90, 0.35);
          border-radius: 999px;
          background: rgba(251, 247, 240, 0.9);
          color: var(--sage);
          width: 2.75rem;
          height: 2.75rem;
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(43, 38, 32, 0.08);
        }
        .sound-toggle:focus-visible {
          outline: 2px solid var(--sage);
          outline-offset: 3px;
        }
      `}</style>
    </main>
  );
}
