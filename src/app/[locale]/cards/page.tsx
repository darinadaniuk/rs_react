import { Suspense } from 'react';

import CardsClient from './_client';

export const dynamic = 'force-dynamic';

export default function CardsPage() {
  return (
    <Suspense fallback={<div />}>
      <CardsClient />
    </Suspense>
  );
}
