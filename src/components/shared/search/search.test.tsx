import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Search } from './search';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Search', () => {
  it('should render input and search icon', () => {
    render(<Search search={vi.fn()} withSearchIcon />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('should render input placeholder', () => {
    render(<Search search={vi.fn()} placeholder="Search characters" />);
    expect(
      screen.getByPlaceholderText('Search characters')
    ).toBeInTheDocument();
  });

  it('should render without icon', () => {
    render(<Search search={vi.fn()} placeholder="Search" />);
    expect(screen.queryByTestId('search-icon')).not.toBeInTheDocument();
  });

  describe('Local storage', () => {
    it('should display search term from localStorage', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('Rick');
      render(<Search search={vi.fn()} />);
      expect(screen.getByTestId('search-input')).toHaveValue('Rick');
    });

    it('should show empty input when nothing was saved', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
      render(<Search search={vi.fn()} />);
      expect(screen.getByTestId('search-input')).toHaveValue('');
    });
  });

  it('should not call search before debounce time', async () => {
    const searchFn = vi.fn();

    vi.useFakeTimers();
    render(<Search search={searchFn} searchDebounce={500} />);
    userEvent.type(screen.getByTestId('search-input'), 'test');
    vi.advanceTimersByTime(300);
    expect(searchFn).not.toHaveBeenCalled();
  });

  it('should search after debounce', (done) => {
    const searchFn = vi.fn(() => {
      try {
        expect(searchFn).toHaveBeenCalledWith('morty');
        done();
      } catch (error) {
        done(error);
      }
    });

    render(<Search search={searchFn} searchDebounce={300} />);
    const input = screen.getByTestId('search-input');

    userEvent.type(input, 'morty').then(() => {
      setTimeout(() => {}, 350);
    });
  });
});
