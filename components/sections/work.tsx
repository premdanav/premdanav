import Link from 'next/link';
import { projects, type Project, type ProjectId } from '@/content';
import { formatPeriod } from '@/lib/format';
import { AnimateWhenVisible } from '../animate-when-visible';
import { ArchitectureDiagram } from '../architecture-diagram';
import { Icon } from '../icons';
import { Reveal } from '../reveal';
import { SectionHeader } from '../section-header';

const BACKDROP: Record<ProjectId, string> = {
  'healthcare-ai-saas': 'from-[#0e1b36] via-[#121228] to-[#22113a]',
  'ehr-integration': 'from-[#2b1022] via-[#141226] to-[#0e1c33]',
  'nutrition-ai': 'from-[#0b2a26] via-[#0f1a26] to-[#0e1b36]',
};

function Visual({ project, tall }: { project: Project; tall?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-edge bg-gradient-to-br ${BACKDROP[project.id]} ${
        tall ? 'h-80 md:h-[26rem] xl:h-[30rem]' : 'h-64 md:h-72'
      }`}
    >
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-70" />
      <AnimateWhenVisible className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-700 group-hover:scale-[1.04] md:p-10">
        <ArchitectureDiagram diagram={project.diagram} compact id={`card-${project.id}`} className="h-full w-full" />
      </AnimateWhenVisible>
      <span className="absolute top-5 left-5 rounded-full border border-white/10 bg-void/60 px-3 py-1 font-mono text-xs text-mist backdrop-blur">
        {project.shape}
      </span>
    </div>
  );
}

function Meta({ project }: { project: Project }) {
  return (
    <p className="font-mono text-sm text-haze">
      {formatPeriod(project.period)} · {project.role}
    </p>
  );
}

export function Work() {
  const [first, ...rest] = projects;

  return (
    <section id="work" className="section-y container-x">
      <SectionHeader service="core-services" label="Selected work" title="Production systems, drawn as architecture">
        Client work under NDA, so instead of screenshots each project is shown as the system it is.
      </SectionHeader>

      <Reveal className="mt-16 flex flex-col gap-10 xl:flex-row xl:gap-12">
        <article data-reveal className="group relative xl:w-[58%]">
          <Visual project={first} tall />
          <div className="mt-6 space-y-4">
            <Meta project={first} />
            <h3 className="text-2xl font-bold tracking-tight md:text-4xl">
              <Link href={`/projects/${first.id}`} className="after:absolute after:inset-0">
                {first.name} — {first.title}
              </Link>
            </h3>
            <p className="max-w-2xl text-lg leading-relaxed text-mist">{first.story}</p>
            <ul aria-label="Stack" className="flex flex-wrap gap-2">
              {first.stack.slice(0, 6).map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <div className="flex flex-col gap-10 md:flex-row xl:w-[42%] xl:flex-col">
          {rest.map((project) => (
            <article key={project.id} data-reveal className="group relative flex-1">
              <Visual project={project} />
              <div className="mt-5 space-y-2">
                <Meta project={project} />
                <h3 className="flex items-start justify-between gap-4 text-xl font-semibold tracking-tight md:text-2xl">
                  <Link href={`/projects/${project.id}`} className="after:absolute after:inset-0">
                    {project.name} — {project.title}
                  </Link>
                  <Icon
                    name="arrowUpRight"
                    className="mt-1 size-6 shrink-0 text-haze transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan"
                  />
                </h3>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
