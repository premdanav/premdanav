'use client';

import type { HTMLAttributes, MouseEvent } from 'react';

/** A card whose border lights up toward the pointer. */
export function GlowCard({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  function track(event: MouseEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const angle = (Math.atan2(y - rect.height / 2, x - rect.width / 2) * 180) / Math.PI;
    el.style.setProperty('--angle', String((angle + 450) % 360));
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  }

  return (
    <div onMouseMove={track} className={`glow-card card ${className}`} {...props}>
      {children}
    </div>
  );
}
