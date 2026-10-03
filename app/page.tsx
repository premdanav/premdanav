import { Abilities } from '@/components/sections/abilities';
import { AiLayer } from '@/components/sections/ai-layer';
import { Contact } from '@/components/sections/contact';
import { Experience } from '@/components/sections/experience';
import { Hero } from '@/components/sections/hero';
import { Skills } from '@/components/sections/skills';
import { SystemMap } from '@/components/sections/system-map';
import { Work } from '@/components/sections/work';
import { defaultResume } from '@/content';
import { publicFileSize } from '@/lib/public-file';
import { withBasePath } from '@/lib/site';

export default async function HomePage() {
  // Only link the PDF if it is actually in public/; otherwise offer to email it.
  const resumeHref = (await publicFileSize(defaultResume.path)) === null ? null : withBasePath(defaultResume.path);

  return (
    <>
      <Hero resumeHref={resumeHref} />
      <SystemMap />
      <Work />
      <Abilities />
      <AiLayer />
      <Experience />
      <Skills />
      <Contact resumeHref={resumeHref} />
    </>
  );
}
