import Link from 'next/link';
import { aiCapabilities, getProject } from '@/content';
import { GlowCard } from '../glow-card';
import { Icon } from '../icons';
import { Reveal } from '../reveal';
import { SectionHeader } from '../section-header';

export function AiLayer() {
  return (
    <section id="ai" className="section-y container-x">
      <SectionHeader service="ai-layer" label="AI work" title={<>AI that ships inside <span className="text-gradient">regulated systems</span></>}>
        Six LLM features from production healthcare and SaaS products, by what goes in and what comes out.
      </SectionHeader>

      <Reveal className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3" stagger={0.1}>
        {aiCapabilities.map((capability) => {
          const project = getProject(capability.projectId)!;
          return (
            <div key={capability.id} id={capability.id} data-reveal className="scroll-mt-28">
              <GlowCard className="flex h-full flex-col p-7">
                <Link href={`/projects/${project.id}`} className="relative z-10 w-fit font-mono text-xs text-cyan hover:underline">
                  {project.name}
                </Link>
                <h3 className="mt-3 text-xl font-semibold">{capability.title}</h3>
                <dl className="mt-5 space-y-3 text-[15px]">
                  {capability.input && (
                    <div className="flex gap-3">
                      <dt className="w-8 shrink-0 font-mono text-xs leading-6 text-haze">in</dt>
                      <dd className="text-mist">{capability.input}</dd>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <dt className="w-8 shrink-0 font-mono text-xs leading-6 text-haze">
                      <Icon name="arrowRight" className="mt-1 size-4 text-cyan" />
                      <span className="sr-only">out</span>
                    </dt>
                    <dd className="text-ink">{capability.output}</dd>
                  </div>
                </dl>
                {capability.stack.length > 0 && (
                  <ul aria-label="Stack" className="mt-auto flex flex-wrap gap-2 pt-6">
                    {capability.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </GlowCard>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
