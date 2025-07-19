import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Card } from './card';

import type { CardItem } from '@rs-react/interfaces';

const mockCard: CardItem = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    name: 'Earth (C-137)',
    url: 'https://rickandmortyapi.com/api/location/1',
  },
  location: {
    name: 'Citadel of Ricks',
    url: 'https://rickandmortyapi.com/api/location/3',
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

describe('Card', () => {
  it('should render the character name', () => {
    const { container } = render(<Card card={mockCard} />);
    const name = container.querySelector('.card-name');
    expect(name).toHaveTextContent('Rick Sanchez');
  });

  it('should render the character text', () => {
    render(<Card card={mockCard} />);
    const species = screen.getByText(/human/i);
    expect(species).toBeInTheDocument();
  });

  it('shoul render the card image', () => {
    render(<Card card={mockCard} />);
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
  });

  it('should render the character image', () => {
    render(<Card card={mockCard} />);
    const image = screen.getByTestId('character-img');
    expect(image).toHaveAttribute('src', mockCard.image);
  });

  it('should handle missing props gracefully', () => {
    // @ts-expect-error for test purposes
    render(<Card card={{}} />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading.textContent?.trim().length).toBe(0);

    const emptyElements = screen.getAllByText('');
    expect(emptyElements.length).toBeGreaterThan(0);

    emptyElements.forEach((elem) => {
      expect(elem.textContent?.trim().length).toBe(0);
    });

    const img = screen.getByTestId('character-img');
    expect(img).not.toHaveAttribute('src');
    expect(img).not.toHaveAttribute('alt');
  });
});
