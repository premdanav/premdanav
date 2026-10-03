import { defaultResume, identity } from '@/content';
import { ContactForm } from '../contact-form';
import { GlowCard } from '../glow-card';
import { Icon, type IconKey } from '../icons';
import { SceneSlot } from '../scene-slot';
import { SectionHeader } from '../section-header';

export function Contact({ resumeHref }: { resumeHref: string | null }) {
  const { email, phone, phoneDisplay, linkedin, github } = identity.contact;
  const channels: { href: string; label: string; icon: IconKey }[] = [
    { href: `mailto:${email}`, label: email, icon: 'mail' },
    { href: `tel:${phone}`, label: phoneDisplay, icon: 'phone' },
    { href: linkedin, label: 'linkedin.com/in/prem-danav', icon: 'linkedin' },
    ...(github ? [{ href: github, label: github.replace(/^https:\/\//, ''), icon: 'github' as const }] : []),
  ];

  return (
    <section id="contact" className="section-y container-x">
      <SectionHeader service="message-queue" label="Contact" title="Let's build something that holds up">
        Hiring for a Java backend or full stack role? Send a message — it lands straight in my inbox.
      </SectionHeader>

      <div className="mt-16 grid gap-8 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <GlowCard className="p-7 md:p-10">
            <ContactForm email={email} />
          </GlowCard>
        </div>

        <div className="flex flex-col gap-6 xl:col-span-7">
          <div className="card relative min-h-96 flex-1 overflow-hidden">
            <SceneSlot scene="contact" className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/90 to-transparent p-6 md:p-8">
              <p className="font-mono text-xs text-haze">PUBLISH message-queue/contact</p>
            </div>
          </div>

          <div id="resume" className="grid scroll-mt-28 gap-4 sm:grid-cols-2">
            <ul className="card space-y-1 p-3">
              {channels.map((c) => (
                <li key={c.href}>
                  <a href={c.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-mist transition-colors hover:bg-panel-2 hover:text-ink">
                    <Icon name={c.icon} className="size-5 shrink-0 text-cyan" />
                    <span className="truncate">{c.label}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3 px-3 py-2.5 text-mist">
                <Icon name="pin" className="size-5 shrink-0 text-cyan" />
                {identity.location}
              </li>
            </ul>

            <div className="card flex flex-col justify-between gap-6 p-6">
              <div>
                <p className="font-mono text-xs text-haze">datastore / resume</p>
                <h3 className="mt-2 text-xl font-semibold">{defaultResume.label}</h3>
                <p className="mt-1 text-sm text-mist">One-page PDF.</p>
              </div>
              {resumeHref ? (
                <a href={resumeHref} download className="btn-outline justify-center">
                  <Icon name="download" className="size-5" /> Download PDF
                </a>
              ) : (
                <a href={`mailto:${email}?subject=Resume%20request`} className="btn-outline justify-center">
                  <Icon name="mail" className="size-5" /> Request by email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
