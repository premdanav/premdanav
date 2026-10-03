import type { NextConfig } from 'next';

/**
 * Static export for GitHub Pages. The deploy workflow sets NEXT_PUBLIC_BASE_PATH to
 * "/<repo>" for a project site, or "" for a <user>.github.io site; locally it is empty.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
};

export default nextConfig;
