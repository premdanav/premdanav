'use client';

import { useRef, type ReactNode } from 'react';
import { useScrollAnimation } from '@/lib/gsap';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay between children marked data-reveal. */
  stagger?: number;
  /** Starting offset: "up" slides from below, "left" from the left. */
  from?: 'up' | 'left';
}

/** Fades content in as it scrolls into view. Content is visible without JavaScript. */
export function Reveal({ children, className, stagger = 0.15, from = 'up' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollAnimation(ref, (gsap, root) => {
    const items = root.querySelectorAll('[data-reveal]');
    gsap.from(items.length > 0 ? items : [root], {
      opacity: 0,
      y: from === 'up' ? 60 : 0,
      x: from === 'left' ? -80 : 0,
      duration: 1,
      ease: 'power3.out',
      stagger,
      scrollTrigger: { trigger: root, start: 'top 85%', once: true },
    });
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
