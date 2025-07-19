import { Component, type ReactNode } from 'react';

import {
  EmptyState,
  Pagination,
  Search,
  Spinner,
  Card,
} from '@rs-react/components';
import { getCards } from '@rs-react/services';

import type { CardsApiResponse, CardsState } from '@rs-react/interfaces';

import './cards.css';

const INITIAL_CARDS_STATE: CardsState = {
  cards: [],
  page: 1,
  searchTerm: localStorage.getItem('cardsSearchTerm') ?? '',
  totalPages: 1,
  loading: false,
  error: null,
};

export class Cards extends Component<Record<string, never>, CardsState> {
  state = { ...INITIAL_CARDS_STATE };

  searchCard = (searchTerm: string): void => {
    this.setState({ searchTerm: searchTerm });
  };

  componentDidMount(): void {
    this.#getCards();
  }

  componentDidUpdate(
    _prevProps: Record<string, never>,
    prevState: CardsState
  ): void {
    const pageChanged = prevState.page !== this.state.page;
    const searchTermChanged = prevState.searchTerm !== this.state.searchTerm;

    if (pageChanged || searchTermChanged) {
      this.#getCards();
    }
  }

  #getCards(): void {
    const { searchTerm, page } = this.state;

    this.setState({ loading: true, error: null });
    getCards(searchTerm, page)
      .then((data: CardsApiResponse) => {
        this.setState({
          cards: data.results,
          totalPages: data.info.pages,
        });
      })
      .catch((err) => {
        this.setState({ error: err.message, cards: [] });
      })
      .finally(() => this.setState({ loading: false }));
  }

  handlePageChange = (value: number): void => {
    this.setState({ page: value });
  };

  render(): ReactNode {
    const { cards, loading, error, page, totalPages } = this.state;
    const noData = !cards || cards.length === 0 || error || loading;

    return (
      <div className="cards">
        <div className="cards-search">
          <Search
            placeholder="Search by name"
            withSearchIcon={true}
            search={this.searchCard}
          />
        </div>
        <div className={`cards-content ${noData ? 'no-data' : ''}`}>
          {loading ? (
            <div className="cards-loader" data-testid="loader">
              <Spinner />
            </div>
          ) : noData ? (
            <div data-testid="empty-state">
              <EmptyState />
            </div>
          ) : (
            cards.map((_card) => <Card key={_card.id} card={_card} />)
          )}
        </div>
        {noData ? null : (
          <div className="pagination">
            <Pagination
              total={totalPages}
              currentPage={page}
              onChange={this.handlePageChange}
            />
          </div>
        )}
      </div>
    );
  }
}
