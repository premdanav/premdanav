import { identity } from '@/content';
import { deploySha } from '@/lib/site';
import { Icon, type IconKey } from './icons';

export function SiteFooter() {
  const { email, linkedin, github } = identity.contact;
  const socials: { href: string; label: string; icon: IconKey }[] = [
    { href: `mailto:${email}`, label: 'Email', icon: 'mail' },
    { href: linkedin, label: 'LinkedIn', icon: 'linkedin' },
    ...(github ? [{ href: github, label: 'GitHub', icon: 'github' as const }] : []),
  ];

  return (
    <footer className="border-t border-edge">
      <div className="container-x grid gap-6 py-10 text-mist md:grid-cols-3 md:items-center">
        <p className="text-center md:text-left">
          {identity.name} · {identity.location}
        </p>
        <ul className="flex justify-center gap-4">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                className="flex size-12 items-center justify-center rounded-xl border border-edge bg-panel transition-colors hover:bg-panel-2 hover:text-ink"
              >
                <Icon name={s.icon} className="size-5" />
              </a>
            </li>
          ))}
        </ul>
        <p className="text-center text-sm md:text-right">
          © {new Date().getFullYear()} {identity.name}
          {deploySha && <span className="ml-2 font-mono text-haze">· {deploySha}</span>}
        </p>
      </div>
    </footer>
  );
}
