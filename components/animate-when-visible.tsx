'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * SVG packet animations run on the main thread, even off screen. This pauses every
 * SVG inside until it scrolls into view, and again when it leaves.
 */
export function AnimateWhenVisible({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const svgs = [...root.querySelectorAll('svg')];
    svgs.forEach((svg) => svg.pauseAnimations());
    const observer = new IntersectionObserver(([entry]) => {
      svgs.forEach((svg) => (entry.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()));
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
