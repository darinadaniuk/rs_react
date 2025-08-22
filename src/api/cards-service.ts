import { CHARACTER_URL } from '@rs-react/constants';

import type { CardItem, CardsApiResponse } from '@rs-react/interfaces';

export const getCards = async (
  searchTerm: string = '',
  page: number = 1,
): Promise<CardsApiResponse> => {
  const params = new URLSearchParams();

  if (searchTerm.trim()) {
    params.append('name', searchTerm.trim());
  }
  params.append('page', String(page));

  const url = `${CHARACTER_URL}?${params.toString()}`;
  const response = await fetch(url);
  const data: CardsApiResponse & { error?: string } = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

export const getCardById = async (id: number): Promise<CardItem> => {
  const response = await fetch(`${CHARACTER_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Card with id ${id} not found`);
  }
  const data: CardItem = await response.json();
  return data;
};
