import { useCallback, useEffect, useRef, useState } from 'react';

const SWIPE_THRESHOLD = 72;
const MAX_VISIBLE_STACK = 5;
const RESET_ANIMATION_MS = 460;

export default function Gallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isDeckEntering, setIsDeckEntering] = useState(false);
  const deckRef = useRef(null);
  const dragStartY = useRef(0);
  const activePointerId = useRef(null);

  const hasCards = currentIndex < images.length;
  const stackImages = images.slice(currentIndex, currentIndex + MAX_VISIBLE_STACK);
  const remainingCount = images.length - currentIndex;

  const resetDeck = useCallback(() => {
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

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return undefined;

    const blockScroll = (event) => {
      if (isDragging) event.preventDefault();
    };

    deck.addEventListener('touchmove', blockScroll, { passive: false });
    return () => deck.removeEventListener('touchmove', blockScroll);
  }, [isDragging]);

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
          <div className="gallery-deck-complete" aria-live="polite">
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
      </div>
    </section>
  );
}
