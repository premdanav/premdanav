import type { Metadata } from 'next';
import { StatusPage } from '@/components/status-page';

export const metadata: Metadata = {
  title: 'Not found',
};

export default function NotFound() {
  return (
    <StatusPage code={404} service="api-gateway" title="No service lives at this path">
      The gateway couldn&apos;t route this request. Everything that exists is one click from the home page.
    </StatusPage>
  );
}
