import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { getCards, getCardById } from '@rs-react/api';

import type { CardsApiResponse, CardItem } from '@rs-react/interfaces';

export const useCardsQuery = (searchTerm: string = '', page: number = 1) => {
  return useQuery<CardsApiResponse, Error>({
    queryKey: ['cards', searchTerm, page],
    queryFn: () => getCards(searchTerm, page),
    staleTime: 30_000,
    cacheTime: 300_000,
    keepPreviousData: true,
  } as UseQueryOptions<CardsApiResponse, Error>);
};

export const useCardByIdQuery = (id: number) => {
  return useQuery<CardItem, Error>({
    queryKey: ['card', id],
    queryFn: () => getCardById(id),
    enabled: !!id,
    staleTime: 60_000,
    cacheTime: 300_000,
  } as UseQueryOptions<CardItem, Error>);
};
