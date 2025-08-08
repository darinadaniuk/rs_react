import { useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Subject,
  takeUntil,
} from 'rxjs';

import { SEARCH_DEBOUNCE_DEFAULT } from '@rs-react/constants';
import { useStorage } from '@rs-react/hooks/local-storage.hook';

import './search.css';

interface SearchProps {
  withSearchIcon?: boolean;
  placeholder?: string;
  searchDebounce?: number;
  search: (value: string) => void;
}

export function Search({
  withSearchIcon,
  placeholder = 'Search',
  searchDebounce = SEARCH_DEBOUNCE_DEFAULT,
  search,
}: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const destroy$ = useRef(new Subject<void>()).current;

  const [searchValue, setSearchValue] = useStorage<string>('cardsSearchTerm', {
    failoverValue: '',
  });

  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    fromEvent<InputEvent>(inputEl, 'input')
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(searchDebounce),
        distinctUntilChanged(),
        takeUntil(destroy$)
      )
      .subscribe((value: string) => {
        const trimmed = value.trim();
        setSearchValue(trimmed);
        search(trimmed);
      });

    return () => {
      destroy$.next();
      destroy$.complete();
    };
  }, [search, searchDebounce, setSearchValue, destroy$]);

  return (
    <div className="search">
      {withSearchIcon && (
        <div data-testid="search-icon" className="search-icon">
          <FaSearch className="icon" />
        </div>
      )}
      <input
        ref={inputRef}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        type="text"
        placeholder={placeholder}
        data-testid="search-input"
        className={`search-input ${withSearchIcon ? 'with-icon' : ''}`}
      />
    </div>
  );
}
