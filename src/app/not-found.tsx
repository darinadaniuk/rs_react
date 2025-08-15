'use client';

import { EmptyState } from '@rs-react/components';

export default function NotFound() {
  return (
    <EmptyState
      title="404 - Page Not Found"
      message="Sorry, the page you are looking for does not exist"
    />
  );
}
