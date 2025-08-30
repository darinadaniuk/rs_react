'use client';

import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations, useFormatter } from 'next-intl';
import { useContext } from 'react';

import { Button } from '@rs-react/components/shared';
import { CardDetailContext } from '@rs-react/context';

import './card-details.css';

export function CardDetails() {
  const t = useTranslations('cardDetails');
  const format = useFormatter();

  const cardDetail = useContext(CardDetailContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('id');
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  if (!cardDetail) return null;

  return (
    <div className="card-details" aria-label={t('title')}>
      <Button text={t('close')} onClick={close} />
      <div className="details-data">
        <Image
          src={cardDetail.image}
          alt={t('imageAlt', { name: cardDetail.name })}
          width={200}
          height={320}
        />
        <p>
          {t('id')}: {cardDetail.id}
        </p>
        <p>
          {t('name')}: {cardDetail.name}
        </p>
        <p>
          {t('species')}: {cardDetail.species}
        </p>
        <p>
          {t('gender')}: {cardDetail.gender}
        </p>
        <p>
          {t('status')}: {cardDetail.status}
        </p>
        <p>
          {t('type')}: {cardDetail.type || t('unknown')}
        </p>
        <p>
          {t('location')}: {cardDetail.location.name || t('unknown')}
        </p>
        <p>
          {t('created')}: {format.dateTime(new Date(cardDetail.created), { dateStyle: 'medium' })}
        </p>
      </div>
    </div>
  );
}
