import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Envelope from './components/Envelope';
import Hero from './components/Hero';
import EventDetails from './components/EventDetails';
import Countdown from './components/Countdown';
import Schedule from './components/Schedule';
import Gallery from './components/Gallery';
import PresenceMessage from './components/DressCode';
import Footer from './components/Footer';
import { defaultWeddingSlug, weddings } from './utils/content';

function WeddingInvitation({ content }) {
  const sectionRefs = useRef([]);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const eventDetailsRef = useRef(null);

  useEffect(() => {
    document.title = content.couple.names;
  }, [content]);

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
    <main className="invitation-page">
      <button
        type="button"
        className="sound-toggle"
        onClick={() => setSoundEnabled((current) => !current)}
        aria-pressed={soundEnabled}
        aria-label={soundEnabled ? 'Pause wedding music' : 'Resume wedding music'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>

      <Envelope names={content.couple.names} isOpen={isEnvelopeOpen} onOpen={handleEnvelopeOpen} soundEnabled={soundEnabled}>
        <Hero couple={content.couple} />
      </Envelope>

      {isEnvelopeOpen && (
        <>
        <br/>
          <div ref={eventDetailsRef} className="content-reveal content-reveal-first">
            <EventDetails couple={content.couple} eventDateTime={content.eventDateTime} />
          </div>
          <div ref={(node) => (sectionRefs.current[0] = node)} className="content-reveal">
            <Countdown date={content.eventDateTime} />
          </div>
          <div ref={(node) => (sectionRefs.current[1] = node)} className="content-reveal">
            <Schedule schedule={content.schedule} />
          </div>
          <div ref={(node) => (sectionRefs.current[2] = node)} className="content-reveal">
            <Gallery images={content.gallery} />
          </div>
          <div ref={(node) => (sectionRefs.current[3] = node)} className="content-reveal">
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
        .invitation-page { position: relative; }
        .content-reveal { opacity: 0; transform: translateY(24px); transition: opacity 750ms ease, transform 750ms cubic-bezier(.2,.7,.2,1); }
        .content-reveal-first { padding-top: clamp(1rem, 3vw, 1.5rem); }
        .sound-toggle {
          position: fixed;
          top: 1.25rem;
          right: 1.25rem;
          z-index: 1000;
          border: 1px solid var(--gold-pale);
          border-radius: 50%;
          background: rgba(255,253,249,0.82);
          backdrop-filter: blur(8px);
          color: var(--sage-deep);
          width: 2.9rem;
          height: 2.9rem;
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(51,43,37,0.08);
          transition: transform 200ms ease, background 200ms ease;
        }
        .sound-toggle:hover { transform: translateY(-2px); background: var(--cream); }
        .sound-toggle:focus-visible {
          outline: 2px solid var(--sage);
          outline-offset: 3px;
        }
      `}</style>
    </main>
  );
}

function resolveWeddingSlug(routeSlug, pathname) {
  if (routeSlug && weddings[routeSlug]) return routeSlug;
  const matchedSlug = pathname.match(/\/w\/([^/?#]+)/)?.[1];
  if (matchedSlug && weddings[matchedSlug]) return matchedSlug;
  return routeSlug ?? matchedSlug;
}

function WeddingRoute() {
  const { slug: routeSlug } = useParams();
  const { pathname } = useLocation();
  const slug = resolveWeddingSlug(routeSlug, pathname);
  const content = slug ? weddings[slug] : undefined;

  if (!content) {
    return (
      <main className="section-shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2rem', maxWidth: '32rem' }}>
          <h1 className="text-script" style={{ fontSize: '2.5rem', margin: '0 0 0.75rem' }}>Wedding invitation not found</h1>
          <p style={{ margin: 0 }}>Please check the invitation link and try again.</p>
        </div>
      </main>
    );
  }

  return <WeddingInvitation key={slug} content={content} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/w/${defaultWeddingSlug}`} replace />} />
      <Route path="/w/:slug" element={<WeddingRoute />} />
      <Route path="*" element={<Navigate to={`/w/${defaultWeddingSlug}`} replace />} />
    </Routes>
  );
}
