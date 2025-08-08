import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, type Mock } from 'vitest';

import * as api from '@rs-react/api';
import * as storageHook from '@rs-react/hooks/local-storage.hook';

import { Cards } from './cards';

import type { CardItem, CardsApiResponse } from '@rs-react/interfaces';

interface PaginationProps {
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface SearchProps {
  search: (value: string) => void;
}

interface CardType {
  id: string | number;
  name: string;
}

interface CardProps {
  card: CardType;
  isActive: boolean;
  onCardClick: (id: string | number) => void;
}

const mockCard = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'image-url',
  status: 'Alive',
};

const mockResponse = {
  results: [mockCard],
  info: { pages: 1 },
};

vi.mock('@rs-react/components', async () => {
  const actual = await vi.importActual('@rs-react/components');
  return {
    ...actual,
    Card: ({ card, isActive, onCardClick }: CardProps) => (
      <div data-testid="card" onClick={() => onCardClick(card.id)}>
        {card.name} {isActive ? '(active)' : ''}
      </div>
    ),
    Search: ({ search }: SearchProps) => (
      <input
        placeholder="Search by name"
        data-testid="search-input"
        onChange={(e) => search(e.target.value)}
      />
    ),
    Spinner: () => <div data-testid="spinner">Loading...</div>,
    EmptyState: () => <div data-testid="empty">No data</div>,
    Pagination: ({ total, currentPage, onPageChange }: PaginationProps) => (
      <button onClick={() => onPageChange(currentPage + 1)}>
        Next Page ({currentPage}/{total})
      </button>
    ),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({}),
    useSearchParams: () => {
      const params = new URLSearchParams();
      return [params, vi.fn()];
    },
  };
});

describe('Cards', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();

    vi.spyOn(api, 'getCards').mockResolvedValue(
      mockResponse as CardsApiResponse
    );
    vi.spyOn(api, 'getCardById').mockResolvedValue(mockCard as CardItem);
    vi.spyOn(storageHook, 'useStorage').mockReturnValue(['', vi.fn()]);
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Cards />}>
              <Route
                path="details/:id"
                element={<div data-testid="detail-outlet" />}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('should render loading state then cards', async () => {
    renderComponent();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('card')).toBeInTheDocument());
  });

  it('renders empty state if no cards returned', async () => {
    (api.getCards as Mock).mockResolvedValueOnce({
      results: [],
      info: { pages: 1 },
    });

    renderComponent();
    await waitFor(() =>
      expect(screen.getByTestId('empty')).toBeInTheDocument()
    );
  });

  it('should render loading state then cards', async () => {
    renderComponent();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('card')).toBeInTheDocument());
  });

  it('should render empty state if no cards returned', async () => {
    (api.getCards as Mock).mockResolvedValueOnce({
      results: [],
      info: { pages: 1 },
    });

    renderComponent();
    await waitFor(() =>
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    );
  });

  it('should update card detail on card click', async () => {
    renderComponent();

    await waitFor(() => expect(screen.getByTestId('card')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('card'));

    await waitFor(() =>
      expect(screen.getByTestId('detail-outlet')).toBeInTheDocument()
    );
  });

  it('should call search and resets page', async () => {
    renderComponent();

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Morty' } });

    await waitFor(() => expect(api.getCards).toHaveBeenCalledWith('Morty', 1));
  });

  it('should call queryClient.invalidateQueries on "Invalidate Cards" button click', () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    renderComponent();

    fireEvent.click(screen.getByText('Invalidate Cards'));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['cards'] });
  });
});
