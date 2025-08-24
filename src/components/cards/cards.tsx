'use client';

import classNames from 'classnames';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';

import {
  EmptyState,
  Pagination,
  Search,
  Spinner,
  Card,
  CardSelectionFlyout,
  Button,
  CardDetails,
  UserForms,
} from '@rs-react/components';
import { useCardsQuery, useCardByIdQuery } from '@rs-react/hooks';
import { useStorage } from '@rs-react/hooks/local-storage.hook';
import { useSelectedItemsStore } from '@rs-react/store';

import type { CardItem } from '@rs-react/interfaces';

import './cards.css';

export const CardDetailContext = createContext<CardItem | undefined>(undefined);

export function Cards() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedCards = useSelectedItemsStore((state) => state.selectedCards);
  const selectionData = selectedCards.map((card) => ({ ...card })) as Record<string, unknown>[];

  const initialPage = Number(searchParams.get('page') ?? '1');
  const [storedSearchTerm, setStoredSearchTerm] = useStorage<string>('cardsSearchTerm', {
    failoverValue: '',
  });
  const initialSearchTerm = searchParams.get('search') ?? storedSearchTerm;

  const [page, setPage] = useState<number>(initialPage);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const {
    data: cardsResponse,
    isLoading: isCardsLoading,
    isError: isCardsError,
    error: cardsError,
  } = useCardsQuery(searchTerm, page);

  const { data: cardDetail, isLoading: isCardDetailLoading } = useCardByIdQuery(activeCardId ?? 0);

  const cards = cardsResponse?.results ?? [];
  const totalPages = cardsResponse?.info?.pages ?? 1;
  const noData = cards.length === 0;

  const cardsContentClass = classNames('cards-content', {
    'no-data': noData || cardsError,
    loading: isCardsLoading,
  });

  useEffect(() => {
    const match = pathname.match(/\/cards\/(\d+)/);
    if (match) {
      setActiveCardId(Number(match[1]));
    } else {
      setActiveCardId(null);
    }
  }, [pathname]);

  useEffect(() => {
    setStoredSearchTerm(searchTerm);
  }, [searchTerm, setStoredSearchTerm]);

  const onCardClick = (cardId: number) => {
    router.push(`/cards/${cardId}?${searchParams.toString()}`);
  };

  const closeCardDetails = () => {
    router.push(`/cards?${searchParams.toString()}`);
  };

  const search = (value: string): void => {
    setSearchTerm(value);
    setPage(1);
  };

  const changePage = (value: number): void => {
    setPage(value);
  };

  return (
    <div className="cards-page">
      <div className="cards">
        <div className="cards-top-section">
          <div className="cards-search">
            <Search placeholder="Search by name" withSearchIcon={true} search={search} />
          </div>
          {!noData && (
            <div className="pagination">
              <Pagination total={totalPages} currentPage={page} onPageChange={changePage} />
            </div>
          )}
        </div>

        <div>
          <UserForms />
        </div>

        <div className={cardsContentClass}>
          {isCardsLoading ? (
            <div className="cards-loader" data-testid="loader">
              <Spinner />
            </div>
          ) : isCardsError ? (
            <div className="cards-error" data-testid="error">
              <EmptyState
                message={
                  (cardsError as Error)?.message ?? 'Something went wrong while fetching cards'
                }
              />
            </div>
          ) : noData ? (
            <div className="cards-empty-state" data-testid="empty-state">
              <EmptyState />
            </div>
          ) : (
            cards.map((_card) => (
              <Card
                key={_card.id}
                card={_card}
                isActive={activeCardId === _card.id}
                onCardClick={onCardClick}
              />
            ))
          )}
          {selectedCards?.length ? (
            <div className="cards-flyout">
              <CardSelectionFlyout cards={selectionData} />
            </div>
          ) : null}
        </div>
      </div>

      {activeCardId && (
        <div className="card-details-wrapper">
          <CardDetailContext.Provider value={cardDetail}>
            {isCardDetailLoading ? (
              <div className="cards-loader" data-testid="card-detail-loader">
                <Spinner />
              </div>
            ) : (
              cardDetail && <CardDetails />
            )}
            <Button text="Close" onClick={closeCardDetails} />
          </CardDetailContext.Provider>
        </div>
      )}
    </div>
  );
}
