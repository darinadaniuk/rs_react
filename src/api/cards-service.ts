import type { CardItem, CardsApiResponse } from '@rs-react/interfaces';

const URL = 'https://rickandmortyapi.com/api/character';

export const getCards = async (
  searchTerm: string = '',
  page: number = 1
): Promise<CardsApiResponse> => {
  const params = new URLSearchParams();

  if (searchTerm.trim()) {
    params.append('name', searchTerm.trim());
  }
  params.append('page', String(page));

  const url = `${URL}?${params.toString()}`;
  const response = await fetch(url);
  const data: CardsApiResponse = await response.json();

  return data;
};

export const getCardById = async (id: number): Promise<CardItem> => {
  const response = await fetch(`${URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Card with id ${id} not found`);
  }
  const data: CardItem = await response.json();
  return data;
};
