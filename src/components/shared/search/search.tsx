'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { fromEvent, debounceTime, distinctUntilChanged, map } from 'rxjs';

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
  const t = useTranslations('search');
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useStorage<string>('cardsSearchTerm', {
    failoverValue: '',
  });

  const safeT = (key: string, fallback: string) => {
    try {
      return t(key);
    } catch {
      return fallback;
    }
  };

  const ph = safeT('placeholder', placeholder);
  const aria = safeT('ariaLabel', placeholder);

  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const sub = fromEvent<InputEvent>(inputEl, 'input')
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(searchDebounce),
        distinctUntilChanged(),
      )
      .subscribe((value: string) => {
        const trimmed = value.trim();
        setSearchValue(trimmed);
        search(trimmed);
      });

    return () => sub.unsubscribe();
  }, [search, searchDebounce, setSearchValue]);

  return (
    <div className="search">
      {withSearchIcon && (
        <div data-testid="search-icon" className="search-icon" aria-hidden="true">
          <FaSearch className="icon" />
        </div>
      )}
      <input
        ref={inputRef}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        type="text"
        placeholder={ph}
        aria-label={aria}
        data-testid="search-input"
        className={`search-input ${withSearchIcon ? 'with-icon' : ''}`}
      />
    </div>
  );
}
