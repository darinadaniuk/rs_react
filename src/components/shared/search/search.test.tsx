import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { Search } from './search';

const setStorageMock = vi.fn();

vi.mock('@rs-react/hooks/local-storage.hook', () => ({
  useStorage: () => ['', setStorageMock],
}));

vi.mock('next-intl', () => ({
  useTranslations: () => () => {
    throw new Error('no intl');
  },
}));

describe('Search', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render input and icon when withSearchIcon is true', () => {
    render(<Search search={vi.fn()} withSearchIcon placeholder="Search" />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('should render without icon when withSearchIcon is false', () => {
    render(<Search search={vi.fn()} placeholder="Search" />);
    expect(screen.queryByTestId('search-icon')).not.toBeInTheDocument();
  });

  it('should use fallback placeholder and aria-label', () => {
    render(<Search search={vi.fn()} placeholder="Search characters" />);
    const input = screen.getByPlaceholderText('Search characters');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-label', 'Search characters');
  });

  it('should not call search before debounce', () => {
    const searchFn = vi.fn();
    render(
      <Search search={searchFn} searchDebounce={500} placeholder="Search" />
    );
    const input = screen.getByTestId('search-input');

    fireEvent.input(input, { target: { value: 'test' } });
    vi.advanceTimersByTime(300);

    expect(searchFn).not.toHaveBeenCalled();
  });

  it('should call search after debounce with trimmed value', () => {
    const searchFn = vi.fn();
    render(
      <Search search={searchFn} searchDebounce={300} placeholder="Search" />
    );
    const input = screen.getByTestId('search-input');

    fireEvent.input(input, { target: { value: '  morty  ' } });
    vi.advanceTimersByTime(300);

    expect(setStorageMock).toHaveBeenCalledWith('morty');
    expect(searchFn).toHaveBeenCalledTimes(1);
    expect(searchFn).toHaveBeenCalledWith('morty');
  });
});
