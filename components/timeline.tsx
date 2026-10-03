'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useScrollAnimation } from '@/lib/gsap';
import { GlowCard } from './glow-card';

export interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  org: string;
  place: string;
  monogram: string;
  /** Engineering roles glow; the path into software stays muted. */
  highlight: boolean;
  bullets: string[];
  tags: string[];
  links: { href: string; label: string }[];
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollAnimation(ref, (gsap, root) => {
    root.querySelectorAll<HTMLElement>('[data-tl-card]').forEach((card) => {
      gsap.from(card, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 82%', once: true },
      });
    });
    gsap.fromTo(
      root.querySelector('[data-tl-progress]'),
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top 65%', end: 'bottom 65%', scrub: true },
      },
    );
  });

  return (
    <div ref={ref} className="relative mt-20">
      <div aria-hidden="true" className="absolute inset-y-0 left-5 w-px bg-edge xl:left-1/3" />
      <div aria-hidden="true" data-tl-progress className="gradient-line absolute inset-y-0 left-5 w-[2px] origin-top -translate-x-[0.5px] xl:left-1/3" />

      <ol className="space-y-14 xl:space-y-20">
        {entries.map((entry) => (
          <li key={entry.id} className="relative grid gap-5 pl-16 xl:grid-cols-3 xl:gap-0 xl:pl-0">
            <span
              aria-hidden="true"
              className={`absolute top-0 left-5 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border font-semibold xl:left-1/3 ${
                entry.highlight ? 'border-cyan/50 bg-panel-2 text-cyan shadow-[0_0_24px_rgb(98_224_255/0.35)]' : 'border-edge bg-panel text-mist'
              }`}
            >
              {entry.monogram}
            </span>

            <div className="xl:pt-1 xl:pr-16 xl:text-right">
              <p className="text-xl font-semibold tracking-tight md:text-2xl">{entry.period}</p>
              <p className="mt-1 text-mist">{entry.place}</p>
            </div>

            <div data-tl-card className="xl:col-span-2 xl:pl-16">
              <GlowCard className="p-7 md:p-9">
                <h3 className="text-2xl font-semibold tracking-tight">{entry.title}</h3>
                <p className="mt-1 text-lg text-cyan">{entry.org}</p>
                {entry.bullets.length > 0 && (
                  <ul className="mt-5 list-disc space-y-3 pl-5 text-mist marker:text-haze">
                    {entry.bullets.map((b) => (
                      <li key={b} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {(entry.tags.length > 0 || entry.links.length > 0) && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {entry.links.map((link) => (
                      <Link key={link.href} href={link.href} className="chip relative z-10 border-cyan/30 text-ink hover:border-cyan">
                        {link.label} →
                      </Link>
                    ))}
                    {entry.tags.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </GlowCard>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
