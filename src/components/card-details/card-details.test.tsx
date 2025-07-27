import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { CardDetailContext } from '@rs-react/pages';

import { CardDetails } from './card-details';

import type { CardItem } from '@rs-react/interfaces';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCardDetail = {
  id: 1,
  name: 'Rick Sanchez',
  species: 'Human',
  gender: 'Male',
  status: 'Alive',
  type: '',
  location: { name: 'Earth (C-137)' },
  created: '2017-11-04T18:48:46.250Z',
};

describe('CardDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render card details when context is provided', () => {
    render(
      <CardDetailContext.Provider value={mockCardDetail as CardItem}>
        <MemoryRouter>
          <CardDetails />
        </MemoryRouter>
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
        <MemoryRouter>
          <CardDetails />
        </MemoryRouter>
      </CardDetailContext.Provider>
    );

    expect(screen.queryByText(/Name:/)).not.toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('should navigate to root when "Close" button is clicked', () => {
    render(
      <CardDetailContext.Provider value={mockCardDetail as CardItem}>
        <MemoryRouter>
          <CardDetails />
        </MemoryRouter>
      </CardDetailContext.Provider>
    );

    fireEvent.click(screen.getByText('Close'));
    expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/' });
  });

  it('should render "Unknown" for location name if location is missing or empty', () => {
    const cardWithNoLocation = { ...mockCardDetail, location: {} };
    render(
      <CardDetailContext.Provider value={cardWithNoLocation as CardItem}>
        <MemoryRouter>
          <CardDetails />
        </MemoryRouter>
      </CardDetailContext.Provider>
    );

    expect(screen.getByText('Location: Unknown')).toBeInTheDocument();
  });
});
