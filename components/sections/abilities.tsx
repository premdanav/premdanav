import { abilities } from '@/content';
import { GlowCard } from '../glow-card';
import { Icon } from '../icons';
import { Reveal } from '../reveal';

export function Abilities() {
  return (
    <section aria-label="What I bring" className="container-x">
      <Reveal className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {abilities.map((ability) => (
          <div key={ability.title} data-reveal>
            <GlowCard className="flex h-full flex-col gap-4 p-8">
              <span className="flex size-14 items-center justify-center rounded-2xl border border-edge bg-panel-2 text-cyan">
                <Icon name={ability.icon} className="size-7" />
              </span>
              <h3 className="mt-2 text-2xl font-semibold">{ability.title}</h3>
              <p className="text-lg leading-relaxed text-mist">{ability.description}</p>
              <ul aria-label="Tools" className="mt-auto flex flex-wrap gap-2 pt-2">
                {ability.tags.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
