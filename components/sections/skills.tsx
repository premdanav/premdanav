import Link from 'next/link';
import { Fragment } from 'react';
import { getProject, skillTiers, type SkillTierId } from '@/content';
import { GlowCard } from '../glow-card';
import { Reveal } from '../reveal';
import { SectionHeader } from '../section-header';

const DOT: Record<SkillTierId, string> = {
  daily: 'bg-mint',
  proven: 'bg-cyan',
  familiar: 'bg-violet',
};

export function Skills() {
  const all = skillTiers.flatMap((t) => t.skills.map((s) => s.name));

  return (
    <section id="skills" className="section-y">
      <div className="container-x">
        <SectionHeader service="runtime" label="Stack" title="The stack, in three orbits">
          The same three rings as the orbit at the top of the page: what I use daily, what has shipped, and what I know.
        </SectionHeader>
      </div>

      <div aria-hidden="true" className="marquee mt-14 overflow-hidden py-2">
        <div className="marquee-track gap-4">
          {[...all, ...all].map((name, i) => (
            <span key={i} className="shrink-0 rounded-full border border-edge bg-panel px-5 py-2.5 text-lg text-mist">
              {name}
            </span>
          ))}
        </div>
      </div>

      <Reveal className="container-x mt-14 grid gap-6 lg:grid-cols-3" stagger={0.12}>
        {skillTiers.map((tier) => (
          <div key={tier.id} data-reveal>
            <GlowCard className="h-full p-7 md:p-8">
              <h3 className="flex items-center gap-3 text-2xl font-semibold">
                <span aria-hidden="true" className={`size-3 rounded-full ${DOT[tier.id]}`} />
                {tier.label}
              </h3>
              <p className="mt-2 text-mist">{tier.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {tier.skills.map((skill) => (
                  <li key={skill.name} className="chip text-[13px]">
                    {skill.name}
                    {skill.evidence && (
                      <span className="ml-1.5 text-haze">
                        ·{' '}
                        {skill.evidence.map((id, i) => (
                          <Fragment key={id}>
                            {i > 0 && ', '}
                            <Link href={`/projects/${id}`} className="relative z-10 hover:text-cyan">
                              {getProject(id)?.name}
                            </Link>
                          </Fragment>
                        ))}
                      </span>
                    )}
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
