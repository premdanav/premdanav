'use client';

import { useCallback, useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

/** seen: has entered the viewport at least once. visible: is in (or near) it now. */
export function useInView(ref: RefObject<Element | null>, rootMargin = '200px') {
  const [state, setState] = useState({ seen: false, visible: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setState((s) => ({ seen: s.seen || entry.isIntersecting, visible: entry.isIntersecting })),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return state;
}

let webglSupport: boolean | undefined;

function supportsWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement('canvas');
      webglSupport = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const noSubscription = () => () => {};

/*
 * Engagement: the first pointer move, touch, scroll, wheel or key press (or a fallback
 * timeout). 3D waits for it so three.js never competes with the initial page load.
 */
const ENGAGE_EVENTS = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'] as const;
const ENGAGE_FALLBACK_MS = 9000;
let engaged = false;
const engageListeners = new Set<() => void>();

function engage() {
  if (engaged) return;
  engaged = true;
  ENGAGE_EVENTS.forEach((e) => window.removeEventListener(e, engage));
  engageListeners.forEach((l) => l());
}

function subscribeEngaged(onChange: () => void) {
  engageListeners.add(onChange);
  if (!engaged && engageListeners.size === 1) {
    ENGAGE_EVENTS.forEach((e) => window.addEventListener(e, engage, { passive: true, once: true }));
    window.setTimeout(engage, ENGAGE_FALLBACK_MS);
  }
  return () => engageListeners.delete(onChange);
}

export function useEngaged(): boolean {
  return useSyncExternalStore(subscribeEngaged, () => engaged, () => false);
}

/** False on the server and during hydration, then the real answer. */
export function useWebGL(): boolean {
  return useSyncExternalStore(noSubscription, supportsWebGL, () => false);
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

/** Scroll the page to a section by id; "hero" means the top. */
export function scrollToSection(id: string) {
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (id === 'hero') {
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
}
