import { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

export default function Envelope({ children, names, isOpen, onOpen, soundEnabled }) {
  const [mounted, setMounted] = useState(false);
  const confettiInstanceRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const burstTimerRef = useRef(null);
  const cleanupTimerRef = useRef(null);
  const audioRef = useRef(null);

  const clearCelebration = () => {
    if (burstTimerRef.current) {
      window.clearTimeout(burstTimerRef.current);
      burstTimerRef.current = null;
    }
    if (cleanupTimerRef.current) {
      window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }
    if (confettiCanvasRef.current) {
      confettiCanvasRef.current.remove();
      confettiCanvasRef.current = null;
    }
    confettiInstanceRef.current?.reset();
    confettiInstanceRef.current = null;
  };

  const clearAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      onOpen();
      setMounted(true);
      return;
    }
    const timer = window.setTimeout(() => setMounted(true), 500);
    return () => {
      window.clearTimeout(timer);
      clearCelebration();
    };
  }, [onOpen]);

  useEffect(() => {
    return () => {
      clearCelebration();
      clearAudio();
    };
  }, []);

  const initials = useMemo(() => {
    const first = names?.split('&')[0]?.trim() || 'A';
    const last = names?.split('&')[1]?.trim() || 'B';
    return `${first[0] || 'A'}${last[0] || 'B'}`;
  }, [names]);

  const playCelebrationSound = () => {
    if (!soundEnabled) return;

    const tryPlayAsset = () => {
      const url = `${import.meta.env.BASE_URL}sounds/wedding-audio.opus`;
      clearAudio();
      const audio = new Audio(url);
      audio.volume = 0.5;
      audio.preload = 'auto';
      audioRef.current = audio;
      audio.addEventListener('ended', () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      }, { once: true });
      audio.play().catch(() => {
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      });
    };

    tryPlayAsset();
  };

  const handleOpen = () => {
    if (isOpen) return;

    onOpen();
    playCelebrationSound();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    clearCelebration();

    const canvas = document.createElement('canvas');
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9998';
    document.body.appendChild(canvas);

    confettiCanvasRef.current = canvas;
    const confettiInstance = confetti.create(canvas, {
      resize: true,
      useWorker: false,
    });
    confettiInstanceRef.current = confettiInstance;

    const context = canvas.getContext('2d');
    if (context) {
      context.scale(ratio, ratio);
    }

    confettiInstance({
      particleCount: 72,
      spread: 95,
      startVelocity: 42,
      ticks: 260,
      colors: ['#7A8B6F', '#E8C4C4', '#B8935A', '#FBF7F0'],
      origin: { x: 0.5, y: 0.58 },
      scalar: 1,
      gravity: 0.8,
      decay: 0.9,
    });

    burstTimerRef.current = window.setTimeout(() => {
      confettiInstance({
        particleCount: 54,
        spread: 120,
        startVelocity: 32,
        ticks: 220,
        colors: ['#7A8B6F', '#E8C4C4', '#B8935A', '#FBF7F0'],
        origin: { x: 0.5, y: 0.6 },
        scalar: 0.9,
        gravity: 0.72,
        decay: 0.92,
      });
    }, 350);

    cleanupTimerRef.current = window.setTimeout(() => {
      clearCelebration();
    }, 3200);
  };

  return (
    <div className="section-shell envelope-stage" style={{ paddingTop: '0', paddingBottom: isOpen ? '0' : 'clamp(1.5rem, 5vw, 3rem)', transition: 'padding-bottom 650ms ease' }}>
      {!isOpen || mounted ? (
        <div
          className={`envelope-shell ${isOpen ? 'open' : ''} ${mounted ? 'mounted' : ''}`}
          aria-label="Illustrated envelope opening to reveal the invitation"
        >
          <button
            type="button"
            className="envelope-trigger"
            onClick={handleOpen}
            aria-label="Open the invitation"
          >
            <div className="envelope">
              <div className="envelope-flap" />
              <div className="envelope-body">
                <div className="wax-seal">{initials}</div>
              </div>
            </div>
          </button>

          <div className="invitation-card">
            {children}
          </div>
        </div>
      ) : null}

      <style>{`
        .envelope-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .envelope-shell {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: min(100%, 760px);
          min-height: min(100vh - 4rem, 720px);
          padding: clamp(1rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1.5rem);
          transition: opacity 650ms ease, min-height 650ms ease;
        }
        .envelope-trigger {
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .envelope-trigger:focus-visible {
          outline: 2px solid var(--sage);
          outline-offset: 6px;
          border-radius: 0.75rem;
        }
        .envelope {
          position: relative;
          width: min(92vw, 300px);
          height: clamp(150px, 34vw, 200px);
          background: var(--ivory);
          border: 1px solid rgba(184,147,90,0.45);
          border-radius: 0 0 1.2rem 1.2rem;
          box-shadow: 0 20px 40px rgba(43,38,32,0.08);
          transform-style: preserve-3d;
          transition: transform 650ms cubic-bezier(.2,.8,.2,1), opacity 650ms ease;
        }
        @media (max-width: 640px) {
          .envelope {
            height: clamp(140px, 45vw, 180px);
          }
        }
        @media (max-width: 480px) {
          .envelope {
            height: 140px;
          }
        }
        .envelope-shell.open .envelope {
          transform: rotateX(180deg) translateY(-24px);
          opacity: 0;
        }
        .envelope-flap {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(122,139,111,0.16), rgba(122,139,111,0.05));
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          transform-origin: top center;
          transition: transform 650ms cubic-bezier(.2,.8,.2,1);
        }
        .envelope-shell.open .envelope-flap {
          transform: rotateX(180deg);
        }
        .envelope-body {
          position: absolute;
          inset: 1.4rem 1rem 1rem;
          border: 1px solid rgba(184,147,90,0.3);
          border-radius: 0 0 1rem 1rem;
          display: grid;
          place-items: center;
        }
        .wax-seal {
          width: clamp(50px, 12vw, 66px);
          height: clamp(50px, 12vw, 66px);
          border-radius: 50%;
          background: var(--sage);
          color: var(--ivory);
          display: grid;
          place-items: center;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: clamp(0.8rem, 2.5vw, 1.2rem);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .invitation-card {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: clamp(1.25rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.5rem) clamp(1.75rem, 6vw, 2.5rem);
          border-radius: 1.2rem;
          background: rgba(255,255,255,0.78);
          opacity: 0;
          transform: scale(0.94);
          transition: opacity 500ms ease, transform 500ms ease;
          box-shadow: 0 20px 45px rgba(43,38,32,0.08);
          box-sizing: border-box;
          overflow: visible;
        }
        .envelope-shell.open .invitation-card {
          opacity: 1;
          transform: scale(1);
        }
        .envelope-shell.mounted .envelope {
          animation: floatEnvelope 1.6s ease-in-out infinite alternate;
        }
        @keyframes floatEnvelope {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .envelope-shell.mounted .envelope { animation: none; }
        }
      `}</style>
    </div>
  );
}
