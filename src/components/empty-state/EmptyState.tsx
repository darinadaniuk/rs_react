import './EmptyState.css';
import noDataIcon from '../../assets/page-not-found.svg';

interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message = 'No data found' }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <img className="empty-icon" src={noDataIcon} alt="No data" />
      <p className="empty-title">{message}</p>
    </div>
  );
}

export default EmptyState;
