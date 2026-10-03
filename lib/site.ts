/** "/<repo>" on a GitHub Pages project site, "" otherwise. Set by the deploy workflow. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Public origin plus base path, no trailing slash, e.g. "https://user.github.io/repo". */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

/** For plain <a href> and other paths Next doesn't prefix itself (next/link does). */
export function withBasePath(path: string): string {
  return `${basePath}${path}`;
}

/** Absolute URL for a site path, e.g. for the sitemap. */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path}`;
}

/** Short SHA of the deployed commit. Undefined outside CI builds, and then not shown. */
export const deploySha = (process.env.GITHUB_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA)?.slice(0, 7);
