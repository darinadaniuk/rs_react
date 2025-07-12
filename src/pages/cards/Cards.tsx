import { Component, type ReactNode } from 'react';
import Search from '../../components/search/Search';
import './Cards.css';
import { getCards } from '../../services/CardsService';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import type { CardsApiResponse, CardsState } from '../../interfaces/Cards';
import Card from '../../components/card/Card';
import EmptyState from '../../components/empty-state/EmptyState';
import CircularProgress from '@mui/material/CircularProgress';

const INITIAL_CARDS_STATE: CardsState = {
  cards: [],
  page: 1,
  searchTerm: localStorage.getItem('cardsSearchTerm') ?? '',
  totalPages: 1,
  loading: false,
  error: null,
};

class Cards extends Component<Record<string, never>, CardsState> {
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

  handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ): void => {
    this.setState({ page: value });
  };

  render(): ReactNode {
    const { cards, loading, error, page, totalPages } = this.state;
    const noData = !cards || cards.length === 0 || error;

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
            <div className="cards-loader">
              <CircularProgress color="primary" />
            </div>
          ) : noData ? (
            <EmptyState />
          ) : (
            cards.map((_card) => <Card key={_card.id} card={_card} />)
          )}
        </div>
        {noData ? null : (
          <div className="pagination">
            <Stack spacing={2} alignItems="center" marginTop={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={this.handlePageChange}
                color="primary"
              />
            </Stack>
          </div>
        )}
      </div>
    );
  }
}

export default Cards;
