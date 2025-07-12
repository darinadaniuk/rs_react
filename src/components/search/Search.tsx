import { Component, createRef, type ReactNode } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Subject,
  takeUntil,
} from 'rxjs';

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
      <TextField
        inputRef={this.#inputRef}
        defaultValue={this.state.searchValue}
        placeholder={this.props.placeholder ?? 'Search'}
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: this.props.withSearchIcon ? (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ) : undefined,
          },
        }}
        fullWidth
      />
    );
  }
}

export default Search;
