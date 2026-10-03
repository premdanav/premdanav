import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AnimateWhenVisible } from '@/components/animate-when-visible';
import { ArchitectureDiagram } from '@/components/architecture-diagram';
import { GlowCard } from '@/components/glow-card';
import { Icon } from '@/components/icons';
import { Reveal } from '@/components/reveal';
import { capabilitiesFor, getProject, getRole, projects } from '@/content';
import { formatPeriod } from '@/lib/format';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<'/projects/[id]'>): Promise<Metadata> {
  const project = getProject((await props.params).id);
  if (!project) return {};
  return { title: `${project.name} — ${project.title}`, description: project.story };
}

export default async function ProjectPage(props: PageProps<'/projects/[id]'>) {
  const project = getProject((await props.params).id);
  if (!project) notFound();

  const role = getRole(project.roleId);
  const capabilities = capabilitiesFor(project.id);
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const nodeLabel = new Map(project.diagram.nodes.map((n) => [n.id, n.label]));

  return (
    <article className="relative isolate">
      <div aria-hidden="true" className="bg-grid absolute inset-x-0 top-0 -z-10 h-[600px]" />

      <header className="container-x pt-36 md:pt-44">
        <Link href="/#work" className="flex w-fit items-center gap-2 text-mist transition-colors hover:text-ink">
          <Icon name="arrowRight" className="size-4 rotate-180" /> All work
        </Link>
        <p className="badge mt-8 flex">
          <span className="font-mono text-cyan">core-services/{project.id}</span>
          <span aria-hidden="true" className="h-3.5 w-px bg-edge" />
          {project.shape}
        </p>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          {project.name} <span className="text-gradient">— {project.title}</span>
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-mist">{project.story}</p>

        <dl className="mt-10 grid gap-6 border-y border-edge py-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-haze">Role</dt>
            <dd className="mt-1 text-lg">
              {project.role}, {role.org}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-haze">Period</dt>
            <dd className="mt-1 text-lg">{formatPeriod(project.period)}</dd>
          </div>
          <div>
            <dt className="text-sm text-haze">Stack</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      <section aria-labelledby="architecture-title" className="container-x mt-16">
        <h2 id="architecture-title" className="text-2xl font-semibold md:text-3xl">
          {project.diagram.title}
        </h2>
        <p className="mt-2 text-mist">{project.diagram.caption}</p>
        <AnimateWhenVisible className="card mt-8 overflow-x-auto p-4 md:p-8">
          <ArchitectureDiagram diagram={project.diagram} id={`full-${project.id}`} className="h-auto w-full min-w-[720px]" />
        </AnimateWhenVisible>
        <ol className="mt-8 grid gap-x-10 gap-y-3 md:grid-cols-2">
          {project.diagram.edges.map((edge, i) => (
            <li key={i} className="flex gap-4 text-[15px]">
              <span className="font-mono text-haze">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="font-mono text-ink">{nodeLabel.get(edge.from)}</span>
                <span className="text-cyan"> {edge.async ? '⇢' : '→'} </span>
                <span className="font-mono text-ink">{nodeLabel.get(edge.to)}</span>
                <span className="block text-mist">{edge.label}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="built-title" className="container-x mt-24">
        <h2 id="built-title" className="text-2xl font-semibold md:text-3xl">
          What I built
        </h2>
        <Reveal className="mt-8 grid gap-5 md:grid-cols-2" stagger={0.1}>
          {project.highlights.map((highlight) => (
            <div key={highlight.text} data-reveal>
              <GlowCard className="h-full p-7">
                <p className="text-lg leading-relaxed">{highlight.text}</p>
              </GlowCard>
            </div>
          ))}
        </Reveal>
      </section>

      {capabilities.length > 0 && (
        <section aria-labelledby="ai-title" className="container-x mt-24">
          <h2 id="ai-title" className="text-2xl font-semibold md:text-3xl">
            AI in this project
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {capabilities.map((c) => (
              <li key={c.id} className="card p-6">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-mist">
                  {c.input && <>{c.input} </>}
                  <span className="text-cyan">→</span> {c.output}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label="Next project" className="container-x mt-28">
        <Link href={`/projects/${next.id}`} className="group card flex items-center justify-between gap-6 p-8 transition-colors hover:border-mist md:p-10">
          <span>
            <span className="block text-sm text-haze">Next project</span>
            <span className="mt-1 block text-2xl font-semibold md:text-3xl">
              {next.name} — {next.title}
            </span>
          </span>
          <Icon name="arrowUpRight" className="size-8 shrink-0 text-haze transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan" />
        </Link>
      </nav>
      <div className="h-24" />
    </article>
  );
}
