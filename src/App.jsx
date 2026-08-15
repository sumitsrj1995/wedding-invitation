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
import ThemeProvider from './themes/ThemeProvider';
import { defaultTheme } from './themes';
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
      <ThemeProvider theme={defaultTheme}>
        <main className="section-shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div className="card" style={{ padding: '2rem', maxWidth: '32rem' }}>
            <h1 className="text-script" style={{ fontSize: '2.5rem', margin: '0 0 0.75rem' }}>Wedding invitation not found</h1>
            <p style={{ margin: 0 }}>Please check the invitation link and try again.</p>
          </div>
        </main>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={content.theme}>
      <WeddingInvitation key={slug} content={content} />
    </ThemeProvider>
  );
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
