export interface CardsState {
  cards: CardItem[];
  page: number;
  searchTerm: string;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

interface Location {
  name: string;
  url: string;
}

export interface CardItem {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CardsApiResponse {
  info: ApiInfo;
  results: CardItem[];
}
