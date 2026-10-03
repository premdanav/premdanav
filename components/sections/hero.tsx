import { currentRole, heroWords, identity } from '@/content';
import { joinList } from '@/lib/format';
import { Icon } from '../icons';
import { SceneSlot } from '../scene-slot';
import { OrbitFallback } from './orbit-fallback';

export function Hero({ resumeHref }: { resumeHref: string | null }) {
  const words = [...heroWords, heroWords[0]];

  return (
    <section id="hero" className="relative isolate overflow-hidden xl:min-h-dvh">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute -top-48 left-1/4 -z-10 h-[620px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgb(82_174_255/0.16),transparent)]"
      />

      <div className="container-x pointer-events-none relative z-10 pt-32 md:pt-40 xl:flex xl:min-h-dvh xl:items-center xl:pt-24">
        <div className="max-w-3xl">
          <p className="badge rise pointer-events-auto">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-mint" />
            </span>
            Open to {joinList(identity.seeking.roles)} roles · {joinList(identity.seeking.locations, 'or')}
          </p>

          <h1 className="mt-8 text-[clamp(2.1rem,7.6vw,3.6rem)] leading-[1.12] font-semibold tracking-tight">
            <span className="rise block" style={{ animationDelay: '0.1s' }}>
              Building
            </span>
            <span className="rise block" style={{ animationDelay: '0.2s' }}>
              <span className="word-slider">
                <span className="word-track">
                  {words.map((word, i) => (
                    <span key={i} className="gap-3 whitespace-nowrap" aria-hidden={i > 0 ? 'true' : undefined}>
                      <span className="hidden size-[0.85em] items-center justify-center rounded-full bg-ink/10 p-[0.16em] text-cyan sm:inline-flex">
                        <Icon name={word.icon} className="size-full" />
                      </span>
                      <span className="text-gradient">{word.text}</span>
                    </span>
                  ))}
                </span>
              </span>
            </span>
            <span className="rise block" style={{ animationDelay: '0.3s' }}>
              where compliance is real
            </span>
            <span className="rise block" style={{ animationDelay: '0.4s' }}>
              and the AI isn&apos;t a demo.
            </span>
          </h1>

          <p className="rise mt-8 max-w-xl text-lg leading-relaxed text-mist md:text-xl" style={{ animationDelay: '0.5s' }}>
            Hi, I&apos;m {identity.shortName.split(' ')[0]} — a {identity.title.toLowerCase()} at {currentRole.org.replace(' Inc.', '')} in{' '}
            {identity.location.split(',')[0]}, working in {joinList(identity.headlineStack)}.
          </p>

          <div className="rise pointer-events-auto mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: '0.6s' }}>
            <a href="#work" className="cta">
              <span className="cta-fill" />
              <span className="cta-label">See my work</span>
              <span className="cta-icon">
                <Icon name="arrowDown" className="size-5" />
              </span>
            </a>
            {resumeHref ? (
              <a href={resumeHref} download className="btn-outline">
                <Icon name="download" className="size-5" /> Resume
              </a>
            ) : (
              <a href={`mailto:${identity.contact.email}?subject=Resume%20request`} className="btn-outline">
                <Icon name="mail" className="size-5" /> Request resume
              </a>
            )}
          </div>
        </div>
      </div>

      <SceneSlot
        scene="orbit"
        className="scene-fade relative h-[62vh] w-full xl:absolute xl:inset-y-0 xl:right-0 xl:left-[40%] xl:h-auto xl:w-auto"
        fallback={<OrbitFallback />}
      />

      <p className="pointer-events-none absolute right-10 bottom-8 hidden font-mono text-xs text-haze xl:block">
        my stack in orbit · drag to rotate
      </p>
    </section>
  );
}
