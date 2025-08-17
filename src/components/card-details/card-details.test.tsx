import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { CardDetailContext } from '@rs-react/context';

import { CardDetails } from './card-details';

import type { CardItem } from '@rs-react/interfaces';

const mockPush = vi.fn();
const mockSearchParams = { toString: () => '' };

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/',
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock('next/image', () => {
  const Img = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  );
  return { __esModule: true, default: Img };
});

const mockCardDetail: Partial<CardItem> = {
  id: 1,
  name: 'Rick Sanchez',
  species: 'Human',
  gender: 'Male',
  status: 'Alive',
  type: '',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  location: { name: 'Earth (C-137)', url: '' },
  created: '2017-11-04T18:48:46.250Z',
};

describe('CardDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render card details when context is provided', () => {
    render(
      <CardDetailContext.Provider value={mockCardDetail as CardItem}>
        <CardDetails />
      </CardDetailContext.Provider>
    );

    expect(screen.getByText('Id: 1')).toBeInTheDocument();
    expect(screen.getByText('Name: Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Species: Human')).toBeInTheDocument();
    expect(screen.getByText('Gender: Male')).toBeInTheDocument();
    expect(screen.getByText('Status: Alive')).toBeInTheDocument();
    expect(screen.getByText('Type: Unknown')).toBeInTheDocument();
    expect(screen.getByText('Location: Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText(/^Created:/)).toBeInTheDocument();
  });

  it('should not render card details if context is null', () => {
    render(
      <CardDetailContext.Provider value={undefined}>
        <CardDetails />
      </CardDetailContext.Provider>
    );

    expect(screen.queryByText(/Name:/)).not.toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('should navigate to root when "Close" button is clicked', () => {
    render(
      <CardDetailContext.Provider value={mockCardDetail as CardItem}>
        <CardDetails />
      </CardDetailContext.Provider>
    );

    fireEvent.click(screen.getByText('Close'));
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should render "Unknown" for location name if location is missing or empty', () => {
    const cardWithNoLocation = {
      ...mockCardDetail,
      location: {} as CardItem['location'],
    };
    render(
      <CardDetailContext.Provider value={cardWithNoLocation as CardItem}>
        <CardDetails />
      </CardDetailContext.Provider>
    );

    expect(screen.getByText('Location: Unknown')).toBeInTheDocument();
  });
});
