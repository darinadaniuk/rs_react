import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { getCards } from '@rs-react/services';

import { Cards } from './cards';

vi.mock('@rs-react/services', () => ({
  getCards: vi.fn(),
}));

describe('Cards', () => {
  const mockCards = {
    info: { pages: 3 },
    results: [
      { id: 1, name: 'Card One' },
      { id: 2, name: 'Card Two' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('cardsSearchTerm', 'test');
  });

  it('should make initial API call', async () => {
    (getCards as ReturnType<typeof vi.fn>).mockResolvedValue(mockCards);
    render(<Cards />);
    expect(getCards).toHaveBeenCalledWith('', 1);
    await waitFor(() =>
      expect(screen.getByText('Card One')).toBeInTheDocument()
    );
  });

  it('should display loader while loading', async () => {
    (getCards as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockCards);
    render(<Cards />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText('Card One')).toBeInTheDocument()
    );
  });

  it('should render EmptyState on API error', async () => {
    (getCards as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Something went wrong')
    );
    render(<Cards />);
    await waitFor(() =>
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    );
  });

  it('should update state on search', async () => {
    (getCards as ReturnType<typeof vi.fn>).mockResolvedValue(mockCards);
    render(<Cards />);
    await waitFor(() => screen.getByText('Card One'));

    const input = screen.getByPlaceholderText('Search by name');
    await userEvent.clear(input);
    await userEvent.type(input, 'morty');
    await waitFor(() => expect(getCards).toHaveBeenLastCalledWith('morty', 1));
  });

  it('should update page on pagination', async () => {
    (getCards as ReturnType<typeof vi.fn>).mockResolvedValue(mockCards);
    render(<Cards />);
    await waitFor(() => screen.getByText('Card One'));

    const pageButton = screen.getByRole('button', { name: '2' });
    await userEvent.click(pageButton);
    await waitFor(() => expect(getCards).toHaveBeenLastCalledWith('', 2));
  });
});
