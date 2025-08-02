import { createContext, useEffect, useState } from 'react';
import { useSearchParams, Outlet, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { getCardById, getCards } from '@rs-react/api';
import {
  EmptyState,
  Pagination,
  Search,
  Spinner,
  Card,
  CardSelectionFlyout,
} from '@rs-react/components';

import type {
  CardItem,
  CardsApiResponse,
  CardsState,
} from '@rs-react/interfaces';

import './cards.css';
import { useStorage } from '@rs-react/hooks/local-storage.hook';
import { useSelectedItemsStore } from '@rs-react/store';

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
  const [cards, setCards] = useState<CardsState['cards']>([]);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [cardDetail, setCardDetail] = useState<CardItem | undefined>(undefined);
  const [cardDetailLoading, setCardDetailLoading] = useState(false);

  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const noData = !cards.length || error || loading;

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
  }, [searchTerm, page]);

  useEffect(() => {
    setStoredSearchTerm(searchTerm);
  }, [searchTerm, setStoredSearchTerm]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getCards(searchTerm, page)
      .then((data: CardsApiResponse) => {
        setCards(data.results);
        setTotalPages(data.info.pages);
        syncActiveCardWithUrl(data.results, activeIdFromUrl);
      })
      .catch((err) => {
        setError(err.message);
        setCards([]);
        setCardDetail(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, searchTerm]);

  const syncActiveCardWithUrl = (
    cards: CardItem[],
    activeIdFromUrl: number | null
  ) => {
    if (activeIdFromUrl && cards.length) {
      const found = cards.find((c) => c.id === activeIdFromUrl);
      if (found) {
        setActiveCardId(found.id);
        setCardDetail(found);
      } else {
        setActiveCardId(null);
        setCardDetail(undefined);
        navigate({
          pathname: '',
          search: searchParams.toString(),
        });
      }
    }
  };

  const search = (value: string): void => {
    setSearchTerm(value);
    setPage(1);
  };

  const changePage = (value: number): void => {
    setPage(value);
  };

  const onCardClick = async (cardId: number): Promise<void> => {
    setCardDetailLoading(true);
    try {
      const detail = await getCardById(cardId);
      setCardDetail(detail);
      setActiveCardId(cardId);
      navigate({
        pathname: `details/${cardId}`,
        search: `?${searchParams.toString()}`,
      });
    } catch {
      setError('Failed to load card details');
    } finally {
      setCardDetailLoading(false);
    }
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

        <div className={`cards-content ${noData ? 'no-data' : ''}`}>
          {loading ? (
            <div className="cards-loader" data-testid="loader">
              <Spinner />
            </div>
          ) : noData ? (
            <div data-testid="empty-state">
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
          {selectedCards?.length && (
            <div className="cards-flyout">
              <CardSelectionFlyout cards={selectionData} />
            </div>
          )}
        </div>
      </div>
      {/* ToDo investigate styles incapsulation */}
      <div className="card-details-wrapper">
        <CardDetailContext.Provider value={cardDetail}>
          {cardDetailLoading ? (
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
