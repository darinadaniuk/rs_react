import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Search } from './search';

const setSearchValueMock = vi.fn();

vi.mock('@rs-react/hooks/local-storage.hook', () => ({
  useStorage: () => ['', setSearchValueMock],
}));

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
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('');
      render(<Search search={vi.fn()} />);
      expect(screen.getByTestId('search-input')).toHaveValue('');
    });

    it('should show empty input when nothing was saved', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
      render(<Search search={vi.fn()} />);
      expect(screen.getByTestId('search-input')).toHaveValue('');
    });
  });

  it('should not call search before debounce time', () => {
    const searchFn = vi.fn();

    vi.useFakeTimers();
    render(<Search search={searchFn} searchDebounce={500} />);
    userEvent.type(screen.getByTestId('search-input'), 'test');
    vi.advanceTimersByTime(300);
    expect(searchFn).not.toHaveBeenCalled();
  });

  it('should call search after debounce', (done) => {
    const searchFn = vi.fn();
    const debounceTime = 300;

    render(<Search search={searchFn} searchDebounce={debounceTime} />);
    const input = screen.getByTestId('search-input');

    userEvent.type(input, 'morty').then(() => {
      setTimeout(() => {
        try {
          expect(searchFn).toHaveBeenCalledTimes(1);
          expect(searchFn).toHaveBeenCalledWith('morty');
          done();
        } catch (error) {
          done(error);
        }
      }, debounceTime + 50);
    });
  });
});
