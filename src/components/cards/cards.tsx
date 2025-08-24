'use client';

import classNames from 'classnames';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import {
  EmptyState,
  Pagination,
  Search,
  Spinner,
  Card,
  CardSelectionFlyout,
  CardDetails,
  UserForms,
} from '@rs-react/components';
import { CardDetailContext } from '@rs-react/context';
import { useCardsQuery, useCardByIdQuery } from '@rs-react/hooks';
import { useStorage } from '@rs-react/hooks/local-storage.hook';
import { useSelectedItemsStore } from '@rs-react/store';

import type { CardItem } from '@rs-react/interfaces';
import './cards.css';

export function Cards() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedCards = useSelectedItemsStore((s) => s.selectedCards);
  const selectionData = selectedCards.map((c) => ({ ...c })) as Record<string, unknown>[];

  const initialPage = Number(searchParams.get('page') ?? '1');
  const [storedSearchTerm, setStoredSearchTerm] = useStorage<string>('cardsSearchTerm', {
    failoverValue: '',
  });
  const initialSearchTerm = searchParams.get('search') ?? storedSearchTerm;

  const [page, setPage] = useState<number>(initialPage);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);

  const activeCardId = useMemo(() => {
    const id = searchParams.get('id');
    return id ? Number(id) : null;
  }, [searchParams]);

  const {
    data: cardsResponse,
    isLoading: isCardsLoading,
    isError: isCardsError,
    error: cardsError,
  } = useCardsQuery(searchTerm, page);

  const cards = cardsResponse?.results ?? [];
  const totalPages = cardsResponse?.info?.pages ?? 1;
  const noData = cards.length === 0;

  const cardFromList = useMemo(
    () => cards.find((c: CardItem) => c.id === activeCardId),
    [cards, activeCardId],
  ) as CardItem | undefined;

  const {
    data: fetchedCard,
    isFetching: isCardDetailFetching,
    isError: isCardDetailError,
    error: cardDetailError,
  } = useCardByIdQuery(activeCardId as number);

  const cardDetail = (cardFromList ?? fetchedCard) as CardItem | undefined;

  const cardsContentClass = classNames('cards-content', {
    'no-data': noData || cardsError,
    loading: isCardsLoading,
  });

  useEffect(() => {
    setStoredSearchTerm(searchTerm);
  }, [searchTerm, setStoredSearchTerm]);

  const onCardClick = (cardId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('id', String(cardId));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const search = (value: string): void => {
    setSearchTerm(value);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', value);
    params.set('page', '1');
    params.delete('id');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const changePage = (value: number): void => {
    setPage(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(value));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
          {cardDetail ? (
            <CardDetailContext.Provider value={cardDetail}>
              <CardDetails />
            </CardDetailContext.Provider>
          ) : isCardDetailFetching ? (
            <div className="cards-loader" data-testid="card-detail-loader">
              <Spinner />
            </div>
          ) : isCardDetailError ? (
            <div className="cards-error" data-testid="card-detail-error">
              <EmptyState
                message={(cardDetailError as Error)?.message ?? 'Failed to load card details'}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
