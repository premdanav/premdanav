'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from './icons';

const LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#ai', label: 'AI' },
];

export function Navbar({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'border-b border-edge bg-void/85 py-3 backdrop-blur-xl' : 'py-5 md:py-8'
      }`}
    >
      <div className="container-x flex items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-2.5 text-lg font-semibold tracking-tight md:text-xl" onClick={() => setOpen(false)}>
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2.5 rounded-full bg-cyan" />
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">{name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="group relative text-mist transition-colors hover:text-ink">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-void transition-colors hover:bg-cyan sm:inline-flex"
          >
            Contact me
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-edge text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} className="size-5" />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="container-x pt-4 pb-2 lg:hidden">
          <ul className="grid gap-1">
            {[...LINKS, { href: '/#contact', label: 'Contact' }].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-lg text-mist hover:bg-panel-2 hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
