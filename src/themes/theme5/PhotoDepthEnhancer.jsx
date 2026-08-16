import { useEffect } from 'react';

const WRAP_CLASS = 'theme5-photo-depth';

function wrapGalleryImage(card) {
  const img = card.querySelector(':scope > img');
  if (!img || card.querySelector(`.${WRAP_CLASS}`)) return;

  const depth = document.createElement('div');
  depth.className = WRAP_CLASS;

  const shadow = document.createElement('div');
  shadow.className = 'theme5-photo-depth__shadow';
  shadow.setAttribute('aria-hidden', 'true');

  const frame = document.createElement('div');
  frame.className = 'theme5-photo-depth__frame';

  const bgLayer = document.createElement('div');
  bgLayer.className = 'theme5-photo-depth__layer theme5-photo-depth__layer--bg';
  const bgImg = img.cloneNode(true);
  bgImg.removeAttribute('alt');
  bgImg.setAttribute('aria-hidden', 'true');
  bgLayer.appendChild(bgImg);

  const fgLayer = document.createElement('div');
  fgLayer.className = 'theme5-photo-depth__layer theme5-photo-depth__layer--fg';
  fgLayer.appendChild(img);

  const shine = document.createElement('div');
  shine.className = 'theme5-photo-depth__shine';
  shine.setAttribute('aria-hidden', 'true');

  const vignette = document.createElement('div');
  vignette.className = 'theme5-photo-depth__vignette';
  vignette.setAttribute('aria-hidden', 'true');

  frame.appendChild(bgLayer);
  frame.appendChild(fgLayer);
  frame.appendChild(shine);
  frame.appendChild(vignette);
  depth.appendChild(shadow);
  depth.appendChild(frame);
  card.appendChild(depth);
}

function enhanceGalleryCards(deck) {
  deck.querySelectorAll('.gallery-deck-card').forEach(wrapGalleryImage);
}

function initPhotoDepth(shell) {
  const deck = shell.querySelector('.gallery-deck');
  if (!deck) return undefined;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const motionScale = reducedMotion ? 0 : isMobile ? 0.62 : 1;

  enhanceGalleryCards(deck);

  const cardObserver = new MutationObserver(() => enhanceGalleryCards(deck));
  cardObserver.observe(deck, { childList: true, subtree: true });

  let mouseX = 0;
  let mouseY = 0;
  let isVisible = false;
  let rafId = 0;

  const update = () => {
    rafId = 0;
    if (!isVisible) return;

    const cards = deck.querySelectorAll('.gallery-deck-card');
    const viewportCenter = window.innerHeight * 0.5;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height * 0.5;
      const dist = (cardCenter - viewportCenter) / window.innerHeight;
      const depthFactor = 1 - index * 0.14;

      const scrollShift = dist * 16 * depthFactor * motionScale;
      const bgShift = scrollShift * 0.42;
      const fgShift = scrollShift * -0.24;

      const isTop = card.classList.contains('gallery-deck-card-top');
      const isDragging = card.classList.contains('is-dragging');
      const isExiting = card.classList.contains('is-exiting');
      const allowTilt = finePointer && isTop && !isDragging && !isExiting && motionScale > 0;

      const tiltX = allowTilt ? -mouseY * 2.4 * depthFactor : 0;
      const tiltY = allowTilt ? mouseX * 3 * depthFactor : 0;
      const lift = allowTilt ? 4 + Math.abs(mouseX) * 2 + Math.abs(mouseY) * 1.5 : 0;

      card.style.setProperty('--t5-scroll-shift', `${scrollShift.toFixed(2)}px`);
      card.style.setProperty('--t5-bg-y', `${bgShift.toFixed(2)}px`);
      card.style.setProperty('--t5-fg-y', `${fgShift.toFixed(2)}px`);
      card.style.setProperty('--t5-tilt-x', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--t5-tilt-y', `${tiltY.toFixed(2)}deg`);
      card.style.setProperty('--t5-lift', `${lift.toFixed(2)}px`);
      card.style.setProperty('--t5-shine-x', `${50 + mouseX * 12}%`);
      card.style.setProperty('--t5-shine-y', `${44 + mouseY * 10}%`);
      card.style.setProperty('--t5-shadow-opacity', `${0.42 + Math.abs(mouseY) * 0.08}`);
    });
  };

  const scheduleUpdate = () => {
    if (!rafId) rafId = window.requestAnimationFrame(update);
  };

  const onMouseMove = (event) => {
    const rect = shell.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    scheduleUpdate();
  };

  const onMouseLeave = () => {
    mouseX = 0;
    mouseY = 0;
    scheduleUpdate();
  };

  const onScroll = () => scheduleUpdate();
  const onResize = () => scheduleUpdate();

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) scheduleUpdate();
    },
    { threshold: 0.08, rootMargin: '10% 0px' }
  );
  visibilityObserver.observe(shell);

  if (finePointer && motionScale > 0) {
    shell.addEventListener('mousemove', onMouseMove, { passive: true });
    shell.addEventListener('mouseleave', onMouseLeave);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  scheduleUpdate();

  return () => {
    cardObserver.disconnect();
    visibilityObserver.disconnect();
    shell.removeEventListener('mousemove', onMouseMove);
    shell.removeEventListener('mouseleave', onMouseLeave);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (rafId) window.cancelAnimationFrame(rafId);
  };
}

export default function PhotoDepthEnhancer() {
  useEffect(() => {
    let cleanup = null;

    const attach = () => {
      if (cleanup) return;
      const shell = document.querySelector('html[data-theme="theme5"] .gallery-deck-shell');
      if (!shell) return;
      cleanup = initPhotoDepth(shell);
    };

    const domObserver = new MutationObserver(attach);
    domObserver.observe(document.body, { childList: true, subtree: true });
    attach();

    return () => {
      domObserver.disconnect();
      cleanup?.();
    };
  }, []);

  return null;
}
