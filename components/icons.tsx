import type { SVGProps } from 'react';
import type { IconName } from '@/content';

const PATHS: Record<IconName | 'arrowRight' | 'arrowDown' | 'arrowUpRight' | 'download' | 'mail' | 'phone' | 'linkedin' | 'github' | 'menu' | 'close' | 'pin', string> = {
  pulse: 'M3 12h4l3-8 4 16 3-8h4',
  spark: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z M9 12l2 2 4-4',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  cloud: 'M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z',
  layers: 'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5',
  arrowRight: 'M5 12h14 M13 6l6 6-6 6',
  arrowDown: 'M12 5v14 M6 13l6 6 6-6',
  arrowUpRight: 'M7 17L17 7 M8 7h9v9',
  download: 'M12 4v11 M7 10l5 5 5-5 M5 20h14',
  mail: 'M4 6h16v12H4z M4 7l8 6 8-6',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  linkedin: 'M4 4h16v16H4z M8 11v5 M8 8v.01 M12 16v-5 M12 13a2 2 0 0 1 4 0v3',
  github:
    'M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  close: 'M6 6l12 12 M18 6L6 18',
  pin: 'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
};

export type IconKey = keyof typeof PATHS;

export function Icon({ name, ...props }: { name: IconKey } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
