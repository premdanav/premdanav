import Link from 'next/link';
import type { ReactNode } from 'react';

interface StatusPageProps {
  code: number;
  service: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

/** A status code rendered as a page: the error states of the trace. */
export function StatusPage({ code, service, title, children, actions }: StatusPageProps) {
  return (
    <section className="relative isolate flex min-h-[80dvh] items-center">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div className="container-x pt-32 pb-20 text-center">
        <div className="flex justify-center">
          <p className="badge">
            <span className="font-mono text-cyan">{service}</span>
          </p>
        </div>
        <p className="text-gradient mt-8 text-[clamp(5rem,18vw,11rem)] leading-none font-bold tracking-tighter">{code}</p>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <div className="mx-auto mt-4 max-w-xl text-lg text-mist">{children}</div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {actions}
          <Link href="/" className="btn-outline">
            Back to the gateway
          </Link>
        </div>
      </div>
    </section>
  );
}
