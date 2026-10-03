import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Mona_Sans } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { SiteFooter } from '@/components/site-footer';
import { identity } from '@/content';
import { siteUrl } from '@/lib/site';
import './globals.css';

const monaSans = Mona_Sans({
  variable: '--font-mona',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: `${identity.name} — ${identity.title}`,
    template: `%s · ${identity.name}`,
  },
  description: identity.summary,
  authors: [{ name: identity.name }],
  openGraph: {
    type: 'website',
    siteName: identity.name,
    title: `${identity.name} — ${identity.title}`,
    description: identity.positioning,
  },
};

export const viewport: Viewport = {
  themeColor: '#040507',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${monaSans.variable} ${geistMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only rounded-full bg-ink px-4 py-2 text-sm font-semibold text-void focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
        >
          Skip to content
        </a>
        <Navbar name={identity.shortName} />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
