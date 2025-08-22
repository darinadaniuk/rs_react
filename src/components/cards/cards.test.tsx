import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, type Mock } from 'vitest';

import * as api from '@rs-react/api';
import * as storageHook from '@rs-react/hooks/local-storage.hook';

import { Cards } from './cards';

import type { CardItem, CardsApiResponse } from '@rs-react/interfaces';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

vi.mock('next-intl/navigation', () => ({
  createLocalizedPathnamesNavigation: () => ({
    Link: (props: { href?: string; children?: React.ReactNode }) => <a {...props} />,
    redirect: vi.fn(),
    usePathname: () => '/',
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  }),
}));

interface CardStubProps {
  card: CardItem;
  isActive: boolean;
  onCardClick: (id: number) => void;
}
interface SearchStubProps {
  search: (value: string) => void;
}
interface PaginationStubProps {
  total: number;
  currentPage: number;
  onPageChange: (p: number) => void;
}

vi.mock('@rs-react/components', () => ({
  Card: ({ card, isActive, onCardClick }: CardStubProps) => (
    <div data-testid="card" onClick={() => onCardClick(card.id)}>
      {card.name} {isActive ? '(active)' : ''}
    </div>
  ),
  Search: ({ search }: SearchStubProps) => (
    <input
      data-testid="search-input"
      placeholder="Search by name"
      onChange={(e) => search((e.target as HTMLInputElement).value)}
    />
  ),
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  EmptyState: () => <div data-testid="empty">No data</div>,
  Pagination: ({ total, currentPage, onPageChange }: PaginationStubProps) => (
    <button onClick={() => onPageChange(currentPage + 1)}>
      Next Page ({currentPage}/{total})
    </button>
  ),
}));

vi.mock('@rs-react/store', () => ({
  useSelectedItemsStore: (sel?: (s: unknown) => unknown) => {
    const state = {
      selectedCards: [] as CardItem[],
      selectItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    return sel ? sel(state) : state;
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()] as const,
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
  info: { pages: 1, count: 1, next: null, prev: null },
};

describe('Cards', () => {
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
              <Route path="details/:id" element={<div data-testid="detail-outlet" />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
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
      info: { pages: 1, count: 0, next: null, prev: null },
    } as CardsApiResponse);

    renderComponent();
    await waitFor(() => expect(screen.getByTestId('empty')).toBeInTheDocument());
  });

  it('should call search and reset page', async () => {
    renderComponent();
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Morty' },
    });
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
    fireEvent.click(screen.getByText(/Next Page/));
    await waitFor(() => expect(api.getCards).toHaveBeenCalledWith('', 2));
  });
});
