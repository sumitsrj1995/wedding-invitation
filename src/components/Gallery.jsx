import { useCallback, useEffect, useRef, useState } from 'react';

const SWIPE_THRESHOLD = 72;
const MAX_VISIBLE_STACK = 5;
const RESET_ANIMATION_MS = 460;

export default function Gallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [completeDragOffset, setCompleteDragOffset] = useState(0);
  const [isCompleteDragging, setIsCompleteDragging] = useState(false);
  const [isCompleteExiting, setIsCompleteExiting] = useState(false);
  const [isDeckEntering, setIsDeckEntering] = useState(false);
  const deckRef = useRef(null);
  const completeRef = useRef(null);
  const dragStartY = useRef(0);
  const activePointerId = useRef(null);

  const hasCards = currentIndex < images.length;
  const isComplete = !hasCards;
  const stackImages = images.slice(currentIndex, currentIndex + MAX_VISIBLE_STACK);
  const remainingCount = images.length - currentIndex;

  const resetDeck = useCallback(() => {
    setCompleteDragOffset(0);
    setIsCompleteDragging(false);
    setIsCompleteExiting(false);
    setDragOffset(0);
    setIsDragging(false);
    setIsExiting(false);
    activePointerId.current = null;
    setCurrentIndex(0);
    setIsDeckEntering(true);

    window.setTimeout(() => {
      setIsDeckEntering(false);
    }, RESET_ANIMATION_MS);
  }, []);

  const triggerResetFromSwipe = useCallback(() => {
    setIsCompleteExiting(true);
    setCompleteDragOffset(-520);

    window.setTimeout(() => {
      resetDeck();
    }, RESET_ANIMATION_MS);
  }, [resetDeck]);

  const finishSwipe = useCallback(() => {
    setIsExiting(true);
    setDragOffset(-520);

    window.setTimeout(() => {
      setCurrentIndex((index) => index + 1);
      setDragOffset(0);
      setIsExiting(false);
    }, RESET_ANIMATION_MS);
  }, []);

  const resetDrag = useCallback(() => {
    setDragOffset(0);
    setIsDragging(false);
    activePointerId.current = null;
  }, []);

  const resetCompleteDrag = useCallback(() => {
    setCompleteDragOffset(0);
    setIsCompleteDragging(false);
    activePointerId.current = null;
  }, []);

  const handlePointerDown = useCallback(
    (event) => {
      if (!hasCards || isExiting || isDeckEntering) return;

      activePointerId.current = event.pointerId;
      dragStartY.current = event.clientY;
      setIsDragging(true);
      deckRef.current?.setPointerCapture(event.pointerId);
    },
    [hasCards, isDeckEntering, isExiting]
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (!isDragging || event.pointerId !== activePointerId.current || isExiting) return;

      const delta = event.clientY - dragStartY.current;
      const nextOffset = delta > 0 ? delta * 0.22 : delta;
      setDragOffset(nextOffset);
    },
    [isDragging, isExiting]
  );

  const handlePointerEnd = useCallback(
    (event) => {
      if (!isDragging || event.pointerId !== activePointerId.current) return;

      deckRef.current?.releasePointerCapture(event.pointerId);

      if (dragOffset < -SWIPE_THRESHOLD) {
        finishSwipe();
        setIsDragging(false);
        activePointerId.current = null;
        return;
      }

      resetDrag();
    },
    [dragOffset, finishSwipe, isDragging, resetDrag]
  );

  const handleCompletePointerDown = useCallback(
    (event) => {
      if (!isComplete || isCompleteExiting || isDeckEntering) return;
      if (event.target.closest('.gallery-deck-reset')) return;

      activePointerId.current = event.pointerId;
      dragStartY.current = event.clientY;
      setIsCompleteDragging(true);
      completeRef.current?.setPointerCapture(event.pointerId);
    },
    [isComplete, isCompleteExiting, isDeckEntering]
  );

  const handleCompletePointerMove = useCallback(
    (event) => {
      if (!isCompleteDragging || event.pointerId !== activePointerId.current || isCompleteExiting) {
        return;
      }

      const delta = event.clientY - dragStartY.current;
      const nextOffset = delta > 0 ? delta * 0.22 : delta;
      setCompleteDragOffset(nextOffset);
    },
    [isCompleteDragging, isCompleteExiting]
  );

  const handleCompletePointerEnd = useCallback(
    (event) => {
      if (!isCompleteDragging || event.pointerId !== activePointerId.current) return;

      completeRef.current?.releasePointerCapture(event.pointerId);

      if (completeDragOffset < -SWIPE_THRESHOLD) {
        setIsCompleteDragging(false);
        activePointerId.current = null;
        triggerResetFromSwipe();
        return;
      }

      resetCompleteDrag();
    },
    [completeDragOffset, isCompleteDragging, resetCompleteDrag, triggerResetFromSwipe]
  );

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return undefined;

    const blockScroll = (event) => {
      if (isDragging) event.preventDefault();
    };

    deck.addEventListener('touchmove', blockScroll, { passive: false });
    return () => deck.removeEventListener('touchmove', blockScroll);
  }, [isDragging]);

  useEffect(() => {
    const complete = completeRef.current;
    if (!complete) return undefined;

    const blockScroll = (event) => {
      if (isCompleteDragging) event.preventDefault();
    };

    complete.addEventListener('touchmove', blockScroll, { passive: false });
    return () => complete.removeEventListener('touchmove', blockScroll);
  }, [isCompleteDragging]);

  const getCardStyle = (stackIndex) => {
    const depth = stackIndex;
    const dragProgress = Math.min(Math.abs(dragOffset) / SWIPE_THRESHOLD, 1);
    const liftProgress = isExiting && depth === 0 ? 1 : depth === 1 ? dragProgress : 0;
    const effectiveDepth = Math.max(0, depth - liftProgress);
    const offsetY = effectiveDepth * 12;
    const offsetX = effectiveDepth * (stackIndex % 2 === 0 ? 6 : -6);
    const scale = 1 - effectiveDepth * 0.028;
    const rotate = effectiveDepth * (stackIndex % 2 === 0 ? 0.8 : -0.8);
    const enterLift = isDeckEntering ? 24 : 0;
    const enterScale = isDeckEntering ? 0.965 : 1;
    const enterOpacity = isDeckEntering ? 0.82 : 1;

    if (depth === 0) {
      const exitY = isExiting ? -520 : dragOffset;
      const exitRotate = isExiting ? -7 : dragOffset * 0.035;
      return {
        zIndex: MAX_VISIBLE_STACK + 2,
        transform: `translate3d(${offsetX}px, ${exitY + enterLift}px, 0) rotate(${exitRotate}deg) scale(${enterScale})`,
        opacity: isExiting ? 0 : enterOpacity
      };
    }

    return {
      zIndex: MAX_VISIBLE_STACK - depth,
      transform: `translate3d(${offsetX}px, ${offsetY + enterLift}px, 0) rotate(${rotate}deg) scale(${scale * enterScale})`,
      opacity: depth > 3 ? 0.72 : enterOpacity
    };
  };

  const completeExitY = isCompleteExiting ? -520 : completeDragOffset;
  const completeExitRotate = isCompleteExiting ? -5 : completeDragOffset * 0.028;

  return (
    <section className="section-shell gallery-section">
      <div className="section-title">Cherished Memories</div>

      <div className="gallery-deck-shell">
        {hasCards ? (
          <div
            ref={deckRef}
            className={['gallery-deck', isDeckEntering ? 'is-entering' : ''].filter(Boolean).join(' ')}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            {stackImages.map((image, stackIndex) => {
              const cardIndex = currentIndex + stackIndex;
              const isTop = stackIndex === 0;
              const cardStyle = getCardStyle(stackIndex);

              return (
                <figure
                  key={image}
                  className={[
                    'gallery-deck-card',
                    isTop ? 'gallery-deck-card-top' : 'gallery-deck-card-peek',
                    isTop && isDragging ? 'is-dragging' : '',
                    isTop && isExiting ? 'is-exiting' : '',
                    isDeckEntering ? 'is-entering' : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={cardStyle}
                  aria-hidden={!isTop}
                >
                  <img
                    src={image}
                    alt={`Wedding gallery image ${cardIndex + 1}`}
                    loading="lazy"
                    draggable={false}
                  />
                </figure>
              );
            })}
          </div>
        ) : (
          <div
            ref={completeRef}
            className={[
              'gallery-deck-complete',
              isCompleteDragging ? 'is-dragging' : '',
              isCompleteExiting ? 'is-exiting' : ''
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              transform: `translate3d(0, ${completeExitY}px, 0) rotate(${completeExitRotate}deg)`,
              opacity: isCompleteExiting ? 0 : 1
            }}
            onPointerDown={handleCompletePointerDown}
            onPointerMove={handleCompletePointerMove}
            onPointerUp={handleCompletePointerEnd}
            onPointerCancel={handleCompletePointerEnd}
            aria-live="polite"
          >
            <span className="text-smallcaps">All moments revealed</span>
            <button type="button" className="button gallery-deck-reset" onClick={resetDeck}>
              Show all photos again
            </button>
          </div>
        )}

        {hasCards && remainingCount > 1 ? (
          <p className="gallery-deck-hint text-smallcaps">
            Swipe up · {remainingCount} photos
          </p>
        ) : null}

        {isComplete && !isCompleteExiting ? (
          <p className="gallery-deck-hint text-smallcaps">Swipe up to start again</p>
        ) : null}
      </div>

      <style>{`
        .gallery-deck-shell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.15rem;
        }

        .gallery-deck {
          position: relative;
          width: min(100%, clamp(17.5rem, 72vw, 26.25rem));
          aspect-ratio: 4 / 5;
          max-height: min(68vh, 32rem);
          margin: 0 auto;
          touch-action: none;
          overscroll-behavior: contain;
          user-select: none;
          -webkit-user-select: none;
          cursor: grab;
        }

        .gallery-deck:active {
          cursor: grabbing;
        }

        .gallery-deck-card {
          position: absolute;
          inset: 0;
          margin: 0;
          overflow: hidden;
          background: linear-gradient(165deg, rgba(231, 212, 205, 0.96) 0%, rgba(231, 212, 205, 0.88) 100%);
          border: 1px solid var(--surface-border-soft);
          border-radius: var(--radius-soft);
          box-shadow:
            var(--surface-shadow-soft),
            var(--surface-highlight),
            inset 0 0 0 1px rgba(255, 253, 249, 0.18);
          transform-origin: center bottom;
          transition:
            transform 460ms cubic-bezier(.2, .65, .25, 1),
            opacity 460ms ease,
            box-shadow 460ms ease;
          will-change: transform, opacity;
        }

        .gallery-deck-card-top:not(.is-dragging):not(.is-exiting):hover {
          box-shadow:
            var(--surface-shadow-lifted),
            var(--surface-highlight),
            inset 0 0 0 1px rgba(255, 253, 249, 0.22);
        }

        .gallery-deck-card-top.is-dragging {
          transition: opacity 460ms ease, box-shadow 460ms ease;
        }

        .gallery-deck-card-top.is-exiting {
          transition:
            transform 520ms cubic-bezier(.22, .85, .24, 1),
            opacity 420ms ease;
        }

        .gallery-deck.is-entering .gallery-deck-card.is-entering {
          transition:
            transform 520ms cubic-bezier(.2, .65, .25, 1),
            opacity 480ms ease;
        }

        .gallery-deck-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          transition: filter 500ms ease;
        }

        .gallery-deck-card-top:not(.is-dragging):not(.is-exiting):hover img {
          filter: saturate(0.92) contrast(1.03);
        }

        .gallery-deck-hint {
          margin: 0;
          color: var(--muted);
          letter-spacing: 0.16em;
        }

        .gallery-deck-complete {
          width: min(100%, clamp(17.5rem, 72vw, 26.25rem));
          aspect-ratio: 4 / 5;
          max-height: min(68vh, 32rem);
          display: grid;
          place-content: center;
          justify-items: center;
          gap: 1.35rem;
          padding: 1.5rem;
          border-radius: var(--radius-soft);
          border: 1px solid var(--surface-border-soft);
          background: var(--surface-bg);
          color: var(--sage);
          box-shadow: var(--surface-shadow-soft), var(--surface-highlight);
          touch-action: none;
          overscroll-behavior: contain;
          user-select: none;
          -webkit-user-select: none;
          cursor: grab;
          transform-origin: center bottom;
          transition:
            transform 460ms cubic-bezier(.2, .65, .25, 1),
            opacity 460ms ease,
            box-shadow 460ms ease;
          will-change: transform, opacity;
          position: relative;
          isolation: isolate;
        }

        .gallery-deck-complete::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(255, 253, 249, 0.24);
        }

        .gallery-deck-complete:active {
          cursor: grabbing;
        }

        .gallery-deck-complete.is-dragging {
          transition: opacity 460ms ease;
        }

        .gallery-deck-complete.is-exiting {
          transition:
            transform 520ms cubic-bezier(.22, .85, .24, 1),
            opacity 420ms ease;
        }

        .gallery-deck-reset {
          min-height: 2.5rem;
          padding-inline: 1rem;
        }

        @media (max-width: 640px) {
          .gallery-deck,
          .gallery-deck-complete {
            width: min(100%, 19.5rem);
            max-height: min(62vh, 28rem);
          }

          .gallery-deck-hint {
            font-size: 0.66rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-deck-card,
          .gallery-deck-card-top.is-exiting,
          .gallery-deck-complete,
          .gallery-deck.is-entering .gallery-deck-card.is-entering {
            transition-duration: 120ms;
          }
        }
      `}</style>
    </section>
  );
}
