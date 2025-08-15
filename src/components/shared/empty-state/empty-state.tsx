import Image from 'next/image';

import noDataIcon from '@rs-react/assets/page-not-found.svg';

import './empty-state.css';

interface EmptyStateProps {
  message?: string;
  title?: string;
}

export function EmptyState({
  message = 'No data found',
  title = '',
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Image
        className="empty-icon"
        src={noDataIcon}
        alt="No data"
        width={200}
        height={320}
        unoptimized
      />
      <p className="empty-title">{title}</p>
      <p className="empty-subtitle">{message}</p>
    </div>
  );
}
