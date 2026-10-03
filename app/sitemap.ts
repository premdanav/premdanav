import type { MetadataRoute } from 'next';
import { projects } from '@/content';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', ...projects.map((p) => `/projects/${p.id}/`)];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
