import noDataIcon from '@rs-react/assets/page-not-found.svg';

import './empty-state.css';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No data found' }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <img className="empty-icon" src={noDataIcon} alt="No data" />
      <p className="empty-title">{message}</p>
    </div>
  );
}
