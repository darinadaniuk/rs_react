import { Component, createRef, type ReactNode } from 'react';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Subject,
  takeUntil,
} from 'rxjs';
import { FaSearch } from 'react-icons/fa';
import './Search.css';

interface SearchProps {
  withSearchIcon?: boolean;
  placeholder?: string;
  searchDebounce?: number;

  search: (value: string) => void;
}

interface SearchState {
  searchValue: string;
}

const SEARCH_DEBOUNCE_DEFAULT = 500;

class Search extends Component<SearchProps, SearchState> {
  state: SearchState = {
    searchValue: localStorage.getItem('cardsSearchTerm') ?? '',
  };

  #inputRef = createRef<HTMLInputElement>();
  #destroy$ = new Subject<void>();

  componentDidMount(): void {
    this.#listenSearch();
  }

  componentWillUnmount(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  #listenSearch(): void {
    const inputEl = this.#inputRef.current;
    if (!inputEl) return;

    fromEvent<InputEvent>(inputEl, 'input')
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.props.searchDebounce ?? SEARCH_DEBOUNCE_DEFAULT),
        distinctUntilChanged(),
        takeUntil(this.#destroy$)
      )
      .subscribe((value: string) => {
        localStorage.setItem('cardsSearchTerm', value.trim());
        this.props.search(value.trim());
      });
  }

  render(): ReactNode {
    return (
      <div className="search">
        {this.props.withSearchIcon && (
          <div className="search-icon">
            <FaSearch className="icon" />
          </div>
        )}
        <input
          ref={this.#inputRef}
          defaultValue={this.state.searchValue}
          type="text"
          placeholder={this.props.placeholder ?? 'Search'}
          className={`search-input ${
            this.props.withSearchIcon ? 'with-icon' : ''
          }`}
        />
      </div>
    );
  }
}

export default Search;
