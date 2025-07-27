import { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Subject,
  takeUntil,
} from 'rxjs';

import './search.css';

interface SearchProps {
  withSearchIcon?: boolean;
  placeholder?: string;
  searchDebounce?: number;
  search: (value: string) => void;
}

const SEARCH_DEBOUNCE_DEFAULT = 500;

export function Search({
  withSearchIcon,
  placeholder = 'Search',
  searchDebounce = SEARCH_DEBOUNCE_DEFAULT,
  search,
}: SearchProps) {
  const [searchValue] = useState(
    () => localStorage.getItem('cardsSearchTerm') ?? ''
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const destroy$ = useRef(new Subject<void>()).current;

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
        localStorage.setItem('cardsSearchTerm', value.trim());
        search(value.trim());
      });

    return () => {
      destroy$.next();
      destroy$.complete();
    };
  }, [search, searchDebounce, destroy$]);

  return (
    <div className="search">
      {withSearchIcon && (
        <div data-testid="search-icon" className="search-icon">
          <FaSearch className="icon" />
        </div>
      )}
      <input
        ref={inputRef}
        defaultValue={searchValue}
        type="text"
        placeholder={placeholder}
        data-testid="search-input"
        className={`search-input ${withSearchIcon ? 'with-icon' : ''}`}
      />
    </div>
  );
}
