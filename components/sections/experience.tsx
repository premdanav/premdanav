import { awards, certifications, education, projects, roles } from '@/content';
import { formatPeriod, formatYearMonth } from '@/lib/format';
import { GlowCard } from '../glow-card';
import { Icon } from '../icons';
import { Reveal } from '../reveal';
import { SectionHeader } from '../section-header';
import { Timeline, type TimelineEntry } from '../timeline';

/** Roles and degrees on one timeline, most recent first. */
function entries(): TimelineEntry[] {
  const fromRoles = roles.map((role) => ({
    sortKey: role.period.end === 'present' ? '9999-99' : role.period.end,
    entry: {
      id: role.id,
      period: formatPeriod(role.period),
      title: role.title,
      org: role.org,
      place: role.location,
      monogram: role.org[0],
      highlight: role.track === 'engineering',
      bullets: role.highlights,
      tags: role.track === 'engineering' ? awards.map((a) => `★ ${a.name} ${a.year}`) : [],
      links: projects.filter((p) => p.roleId === role.id).map((p) => ({ href: `/projects/${p.id}`, label: p.name })),
    },
  }));
  const fromEducation = education
    .filter((e) => e.level !== 'school')
    .map((e) => ({
      sortKey: `${e.year}-00`,
      entry: {
        id: e.id,
        period: String(e.year),
        title: e.qualification,
        org: e.institution,
        place: e.level === 'postgraduate' ? 'Postgraduate diploma' : 'Undergraduate degree',
        monogram: e.institution[0],
        highlight: false,
        bullets: [],
        tags: [e.result],
        links: [],
      },
    }));
  return [...fromRoles, ...fromEducation].sort((a, b) => b.sortKey.localeCompare(a.sortKey)).map((x) => x.entry);
}

export function Experience() {
  const cert = certifications[0];

  return (
    <section id="experience" className="section-y container-x">
      <SectionHeader service="auth-service" label="Career" title={<>The road to <span className="text-gradient">production healthcare systems</span></>}>
        Content operations at Pedagogy, CDAC&apos;s PG-DAC, then building production software at {roles[0].org.replace(' Inc.', '')} since{' '}
        {formatYearMonth(roles[0].period.start)}.
      </SectionHeader>

      <Timeline entries={entries()} />

      <div className="mt-28">
        <div className="flex justify-center">
          <p className="badge">
            <span className="font-mono text-cyan">datastore</span>
            <span aria-hidden="true" className="h-3.5 w-px bg-edge" />
            Record
          </p>
        </div>
        <Reveal className="mt-10 grid gap-6 md:grid-cols-3">
          <div data-reveal>
            <GlowCard className="h-full p-7">
              <Icon name="shield" className="size-8 text-amber" />
              <h3 className="mt-5 text-lg font-semibold">{cert.name}</h3>
              <p className="mt-1 font-mono text-sm text-mist">{cert.code}</p>
              <p className="mt-4 text-sm text-haze">
                {cert.issuer} · valid until {formatYearMonth(cert.validUntil)}
              </p>
            </GlowCard>
          </div>
          <div data-reveal>
            <GlowCard className="h-full p-7">
              <Icon name="spark" className="size-8 text-violet" />
              <ul className="mt-5 space-y-4">
                {awards.map((award) => (
                  <li key={award.name}>
                    <h3 className="text-lg font-semibold">
                      {award.name} {award.year}
                    </h3>
                    <p className="text-sm text-haze">
                      {award.org} · {award.citation}
                    </p>
                  </li>
                ))}
              </ul>
            </GlowCard>
          </div>
          <div data-reveal>
            <GlowCard className="h-full p-7">
              <Icon name="layers" className="size-8 text-mint" />
              <ul className="mt-5 space-y-2.5">
                {education.map((e) => (
                  <li key={e.id} className="flex items-baseline justify-between gap-4">
                    <span>
                      {e.qualification} <span className="text-sm text-haze">· {e.year}</span>
                    </span>
                    <span className="font-mono text-sm text-mist">{e.result}</span>
                  </li>
                ))}
              </ul>
            </GlowCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
