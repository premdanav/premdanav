import { SceneSlot } from '../scene-slot';
import { SectionHeader } from '../section-header';
import { TopologyFallback } from './topology-fallback';

/** The site drawn as the architecture Prem builds; each service opens a section. */
export function SystemMap() {
  return (
    <section id="system" className="section-y container-x">
      <SectionHeader service="api-gateway" label="System map" title={<>This portfolio, drawn as <span className="text-gradient">the systems I build</span></>}>
        Gateway, auth, services, AI layer, datastore and queue. Drag to look around, click a service to open its section.
      </SectionHeader>

      <div className="relative mt-14 overflow-hidden rounded-3xl border border-edge bg-void">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <SceneSlot scene="topology" className="relative h-[460px] md:h-[620px]" fallback={<TopologyFallback />} />
        <p className="pointer-events-none absolute right-6 bottom-5 font-mono text-xs text-haze">drag to rotate · click a service</p>
      </div>
    </section>
  );
}
