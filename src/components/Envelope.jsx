import { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { useUiStrings } from '../context/LanguageContext';

export default function Envelope({ children, names, isOpen, onOpen, soundEnabled }) {
  const ui = useUiStrings();
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

  useEffect(() => {
    if (soundEnabled) {
      const audio = audioRef.current;
      if (audio) {
        // Resuming happens in response to the sound button's click, so browsers
        // allow playback even after the invitation has already been opened.
        audio.play().catch(() => {});
      } else if (isOpen) {
        playCelebrationSound();
      }
    } else {
      audioRef.current?.pause();
    }
  }, [soundEnabled, isOpen]);

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
      // Keep the instance after an interrupted play request. Pausing while a
      // play promise is pending rejects that promise, but the same audio can
      // still be resumed by the sound button.
      audio.play().catch(() => {});
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
      ticks: 520,
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
        ticks: 440,
        colors: ['#7A8B6F', '#E8C4C4', '#B8935A', '#FBF7F0'],
        origin: { x: 0.5, y: 0.6 },
        scalar: 0.9,
        gravity: 0.72,
        decay: 0.92,
      });
    }, 700);

    cleanupTimerRef.current = window.setTimeout(() => {
      clearCelebration();
    }, 6400);
  };

  return (
    <div className="section-shell envelope-stage" style={{ paddingTop: '0', paddingBottom: isOpen ? '0' : 'clamp(1.5rem, 5vw, 3rem)', transition: 'padding-bottom 650ms ease' }}>
      {!isOpen || mounted ? (
        <div
          className={`envelope-shell ${isOpen ? 'open' : ''} ${mounted ? 'mounted' : ''}`}
          aria-label={ui.envelopeDescription}
        >
          <button
            type="button"
            className="envelope-trigger"
            onClick={handleOpen}
            aria-label={ui.openInvitation}
          >
            <div className="envelope">
              {/* <div className="envelope-flap" /> */}
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
    </div>
  );
}
