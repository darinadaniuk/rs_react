import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, type Mock } from 'vitest';

import * as api from '@rs-react/api';
import * as storageHook from '@rs-react/hooks/local-storage.hook';

import { Cards } from './cards';

import type { CardItem, CardsApiResponse } from '@rs-react/interfaces';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    query: {},
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

vi.mock('@rs-react/components', async () => {
  const actual = await vi.importActual('@rs-react/components');
  return {
    ...actual,
    Card: ({
      card,
      isActive,
      onCardClick,
    }: {
      card: CardItem;
      isActive: boolean;
      onCardClick: (id: number) => void;
    }) => (
      <div data-testid="card" onClick={() => onCardClick(card.id)}>
        {card.name} {isActive ? '(active)' : ''}
      </div>
    ),
    Search: ({ search }: { search: (value: string) => void }) => (
      <input
        placeholder="Search by name"
        data-testid="search-input"
        onChange={(e) => search(e.target.value)}
      />
    ),
    Spinner: () => <div data-testid="spinner">Loading...</div>,
    EmptyState: () => <div data-testid="empty">No data</div>,
    Pagination: ({
      total,
      currentPage,
      onPageChange,
    }: {
      total: number;
      currentPage: number;
      onPageChange: (page: number) => void;
    }) => (
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
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

const mockCard: Partial<CardItem> = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'image-url',
  status: 'Alive',
};

const mockResponse: CardsApiResponse = {
  results: [mockCard as CardItem],
  info: {
    pages: 1,
    count: 0,
    next: null,
    prev: null,
  },
};

describe('Cards component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();

    vi.spyOn(api, 'getCards').mockResolvedValue(mockResponse);
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
    expect(screen.getByText(/Rick Sanchez/)).toBeInTheDocument();
  });

  it('should render empty state if no cards returned', async () => {
    (api.getCards as Mock).mockResolvedValueOnce({
      results: [],
      info: { pages: 1 },
    } as unknown as CardsApiResponse);

    renderComponent();
    await waitFor(() =>
      expect(screen.getByTestId('empty')).toBeInTheDocument()
    );
  });

  it('should call search and reset page', async () => {
    renderComponent();

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Morty' } });

    await waitFor(() => expect(api.getCards).toHaveBeenCalledWith('Morty', 1));
  });

  it('should open card details on click', async () => {
    renderComponent();

    await waitFor(() => expect(screen.getByTestId('card')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('card'));
  });

  it('should handle pagination', async () => {
    renderComponent();

    await waitFor(() => expect(screen.getByTestId('card')).toBeInTheDocument());

    const nextPageBtn = screen.getByText(/Next Page/);
    fireEvent.click(nextPageBtn);

    await waitFor(() => expect(api.getCards).toHaveBeenCalledWith('', 2));
  });
});
