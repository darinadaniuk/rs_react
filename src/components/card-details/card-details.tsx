'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext } from 'react';

import { Button } from '@rs-react/components/shared';
import { CardDetailContext } from '@rs-react/context';

import './card-details.css';

export function CardDetails() {
  const cardDetail = useContext(CardDetailContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const close = () => {
    const search = searchParams.toString();
    router.push(`/${search ? `?${search}` : ''}`);
  };

  return (
    <div className="card-details">
      <Button text="Close" onClick={close} />
      {cardDetail && (
        <div className="details-data">
          <Image
            src={cardDetail.image}
            alt={cardDetail.name}
            fill
            style={{ objectFit: 'contain' }}
          />
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
              new Date(cardDetail.created),
            )}
          </p>
        </div>
      )}
    </div>
  );
}
