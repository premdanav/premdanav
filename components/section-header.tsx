import type { ReactNode } from 'react';

interface SectionHeaderProps {
  /** The service node this section belongs to in the 3D trace. */
  service: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
}

export function SectionHeader({ service, label, title, children }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="badge">
        <span className="font-mono text-cyan">{service}</span>
        <span aria-hidden="true" className="h-3.5 w-px bg-edge" />
        {label}
      </p>
      <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">{title}</h2>
      {children && <p className="max-w-2xl text-lg leading-relaxed text-mist">{children}</p>}
    </div>
  );
}
