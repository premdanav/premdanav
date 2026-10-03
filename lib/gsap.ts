'use client';

import { useEffect, useRef, type RefObject } from 'react';

type Gsap = typeof import('gsap').gsap;

let loading: Promise<Gsap> | null = null;

/** GSAP + ScrollTrigger, fetched after hydration so they stay out of first-load JS. */
function loadGsap(): Promise<Gsap> {
  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    return gsap;
  });
  return loading;
}

/**
 * Runs scroll animations scoped to `scope` once GSAP has loaded, only when the visitor
 * hasn't asked for reduced motion. Everything is reverted on unmount. Content must be
 * fully visible without this running.
 */
export function useScrollAnimation(scope: RefObject<HTMLElement | null>, setup: (gsap: Gsap, root: HTMLElement) => void) {
  const latest = useRef(setup);

  useEffect(() => {
    latest.current = setup;
  });

  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap().then((gsap) => {
      const root = scope.current;
      if (cancelled || !root) return;
      const ctx = gsap.context(() => {
        gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => latest.current(gsap, root));
      }, root);
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [scope]);
}
