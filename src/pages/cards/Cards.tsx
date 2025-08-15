import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { createContext, useEffect, useState } from 'react';
import {
  useSearchParams,
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  EmptyState,
  Pagination,
  Search,
  Spinner,
  Card,
  CardSelectionFlyout,
  Button,
} from '@rs-react/components';
import { useCardsQuery, useCardByIdQuery } from '@rs-react/hooks';
import { useStorage } from '@rs-react/hooks/local-storage.hook';
import { useSelectedItemsStore } from '@rs-react/store';

import type { CardItem } from '@rs-react/interfaces';

import './cards.css';

export const CardDetailContext = createContext<CardItem | undefined>(undefined);

export function Cards() {
  const navigate = useNavigate();
  const { id } = useParams();
  const activeIdFromUrl = id ? Number(id) : null;

  const selectedCards = useSelectedItemsStore((state) => state.selectedCards);
  const selectionData = selectedCards.map((card) => ({ ...card })) as Record<
    string,
    unknown
  >[];

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page') ?? '1');
  const [storedSearchTerm, setStoredSearchTerm] = useStorage<string>(
    'cardsSearchTerm',
    { failoverValue: '' }
  );
  const initialSearchTerm = searchParams.get('search') ?? storedSearchTerm;

  const [page, setPage] = useState<number>(initialPage);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [activeCardId, setActiveCardId] = useState<number | null>(
    activeIdFromUrl
  );

  const queryClient = useQueryClient();

  const {
    data: cardsResponse,
    isLoading: isCardsLoading,
    isError: isCardsError,
    error: cardsError,
  } = useCardsQuery(searchTerm, page);

  const { data: cardDetail, isLoading: isCardDetailLoading } = useCardByIdQuery(
    activeIdFromUrl ?? 0
  );

  const cards = cardsResponse?.results ?? [];
  const totalPages = cardsResponse?.info?.pages ?? 1;
  const noData = cards.length === 0;

  const cardsContentClass = classNames('cards-content', {
    'no-data': noData || cardsError,
    loading: isCardsLoading,
  });

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['cards'] });
  };

  const refreshPage = () => {
    queryClient.invalidateQueries({
      queryKey: ['cards', searchTerm, page],
      exact: true,
    });
  };

  const refreshCardDetails = () => {
    if (activeCardId) {
      queryClient.invalidateQueries({ queryKey: ['card', activeCardId] });
    }
  };

  const immediateCardsRefresh = () => {
    queryClient.refetchQueries({ queryKey: ['cards'], type: 'active' });
  };

  useEffect(() => {
    const newParams = new URLSearchParams();

    if (searchTerm.trim()) {
      newParams.set('search', searchTerm.trim());
    }
    if (page) {
      newParams.set('page', page.toString());
    }

    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams);
    }
  }, [searchTerm, page, searchParams, setSearchParams]);

  useEffect(() => {
    setStoredSearchTerm(searchTerm);
  }, [searchTerm, setStoredSearchTerm]);

  useEffect(() => {
    setActiveCardId(activeIdFromUrl);
  }, [activeIdFromUrl]);

  const onCardClick = (cardId: number) => {
    navigate({
      pathname: `details/${cardId}`,
      search: `?${searchParams.toString()}`,
    });
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
            <Search
              placeholder="Search by name"
              withSearchIcon={true}
              search={search}
            />
          </div>
          {!noData && (
            <div className="pagination">
              <Pagination
                total={totalPages}
                currentPage={page}
                onPageChange={changePage}
              />
            </div>
          )}
        </div>
        <div className="demo-section">
          <p>Manual control buttons for demo</p>
          <Button text="Invalidate ALL" onClick={refreshAll} />
          <Button text="Invalidate PAGE" onClick={refreshPage} />
          <Button text="Invalidate Card Detail" onClick={refreshCardDetails} />
          <Button text="Trigger fetch" onClick={immediateCardsRefresh} />
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
                  (cardsError as Error)?.message ??
                  'Something went wrong while fetching cards'
                }
              />
              <Button text="Retry" onClick={refreshAll} />
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

      <div className="card-details-wrapper">
        <CardDetailContext.Provider value={cardDetail}>
          {isCardDetailLoading ? (
            <div className="cards-loader" data-testid="card-detail-loader">
              <Spinner />
            </div>
          ) : (
            <Outlet />
          )}
        </CardDetailContext.Provider>
      </div>
    </div>
  );
}
