import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@rs-react/components/shared';
import { CardDetailContext } from '@rs-react/pages';

import './card-details.css';

export function CardDetails() {
  const cardDetail = useContext(CardDetailContext);
  const navigate = useNavigate();

  const close = () => {
    navigate({ pathname: `/` });
  };

  return (
    <div className="card-details">
      <Button text="Close" onClick={close} />
      {cardDetail && (
        <div className="details-data">
          <p>Id: {cardDetail.id}</p>
          <p>Name: {cardDetail.name}</p>
          <p>Species: {cardDetail.species}</p>
          <p>Gender: {cardDetail.gender}</p>
          <p>Status: {cardDetail.status}</p>
          <p>Type: {cardDetail.type || 'Unknown'}</p>
          <p>Location: {cardDetail.location.name || 'Unknown'}</p>
          <p>
            Created:{' '}
            {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
              new Date(cardDetail.created)
            )}
          </p>
        </div>
      )}
    </div>
  );
}
