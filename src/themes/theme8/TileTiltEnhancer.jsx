import { useEffect } from 'react';

const TILE_SELECTOR = [
  '.event-card',
  '.countdown-grid',
  '.schedule-timeline',
  '.presence-panel',
  '.gallery-deck-card'
].join(',');

const MAX_TILT = 10.5;
const MAX_LIFT = 26;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function shouldSkipTile(element) {
  return element.matches('.invitation-card') && element.closest('.envelope-shell:not(.open)');
}

function clearTile(element, stateMap) {
  if (!element.classList.contains('t8-tile')) return;
  element.classList.remove('t8-tile', 'is-hover', 'is-active');
  element.style.removeProperty('--t8-tile-rx');
  element.style.removeProperty('--t8-tile-ry');
  element.style.removeProperty('--t8-tile-lift');
  stateMap.delete(element);
}

function enhanceTile(element, stateMap) {
  if (element.classList.contains('t8-tile')) return null;
  element.classList.add('t8-tile');
  stateMap.set(element, {
    rx: 0,
    ry: 0,
    lift: 0,
    targetRx: 0,
    targetRy: 0,
    targetLift: 0,
    hovering: false,
    touching: false
  });
  return element;
}

function setTilt(state, nx, ny, active) {
  const cx = clamp(nx, -1, 1);
  const cy = clamp(ny, -1, 1);
  state.targetRy = cx * MAX_TILT;
  state.targetRx = -cy * MAX_TILT;
  state.targetLift = active ? MAX_LIFT : 0;
}

function applyTransform(state, element) {
  state.rx += (state.targetRx - state.rx) * (state.hovering || state.touching ? 0.42 : 0.16);
  state.ry += (state.targetRy - state.ry) * (state.hovering || state.touching ? 0.42 : 0.16);
  state.lift += (state.targetLift - state.lift) * (state.hovering || state.touching ? 0.36 : 0.14);
  element.style.setProperty('--t8-tile-rx', `${state.rx.toFixed(2)}deg`);
  element.style.setProperty('--t8-tile-ry', `${state.ry.toFixed(2)}deg`);
  element.style.setProperty('--t8-tile-lift', `${state.lift.toFixed(2)}px`);
}

function initTileTilt(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

  const stateMap = new Map();
  const tiles = [];
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  let hoveredTile = null;
  let raf = 0;

  const scan = () => {
    tiles.length = 0;
    root.querySelectorAll(TILE_SELECTOR).forEach((node) => {
      if (shouldSkipTile(node)) {
        clearTile(node, stateMap);
        return;
      }
      if (enhanceTile(node, stateMap)) tiles.push(node);
      else if (node.classList.contains('t8-tile')) tiles.push(node);
    });
    root.querySelectorAll('.invitation-card').forEach((node) => {
      if (shouldSkipTile(node)) clearTile(node, stateMap);
      else if (enhanceTile(node, stateMap)) tiles.push(node);
    });
  };

  scan();
  const observer = new MutationObserver(scan);
  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

  const pointerNorm = (tile, clientX, clientY) => {
    const rect = tile.getBoundingClientRect();
    return {
      nx: (clientX - (rect.left + rect.width * 0.5)) / (rect.width * 0.5),
      ny: (clientY - (rect.top + rect.height * 0.5)) / (rect.height * 0.5)
    };
  };

  const onMouseMove = (event) => {
    if (!finePointer || isMobile) return;
    const tile = event.target.closest('.t8-tile');
    if (!tile || !root.contains(tile)) {
      if (hoveredTile) {
        const state = stateMap.get(hoveredTile);
        if (state) {
          state.hovering = false;
          setTilt(state, 0, 0, false);
        }
        hoveredTile.classList.remove('is-hover');
        hoveredTile = null;
      }
      return;
    }
    if (hoveredTile !== tile) {
      if (hoveredTile) {
        const prev = stateMap.get(hoveredTile);
        if (prev) {
          prev.hovering = false;
          setTilt(prev, 0, 0, false);
        }
        hoveredTile.classList.remove('is-hover');
      }
      hoveredTile = tile;
      tile.classList.add('is-hover');
    }
    const state = stateMap.get(tile);
    if (!state) return;
    const { nx, ny } = pointerNorm(tile, event.clientX, event.clientY);
    state.hovering = true;
    setTilt(state, nx, ny, true);
  };

  const tick = () => {
    raf = requestAnimationFrame(tick);
    stateMap.forEach((state, element) => applyTransform(state, element));
  };

  root.addEventListener('mousemove', onMouseMove, { passive: true });
  raf = requestAnimationFrame(tick);

  return () => {
    observer.disconnect();
    root.removeEventListener('mousemove', onMouseMove);
    cancelAnimationFrame(raf);
  };
}

export default function TileTiltEnhancer() {
  useEffect(() => {
    let cleanup = null;
    const attach = () => {
      if (cleanup) return;
      const root = document.querySelector('html[data-theme="theme8"] .theme-stage');
      if (!root) return;
      cleanup = initTileTilt(root);
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
