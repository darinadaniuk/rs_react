import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

type TestCardItem = {
  id: number;
  name: string;
  species: string;
  gender: string;
  status: string;
  type: string;
  location: { name: string };
  image: string;
  created: string;
};

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

let mockPathname = '/cards';
let mockSearch = 'id=1&search=rick&page=2';
const push = vi.fn<(url: string, options?: { scroll?: boolean }) => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(mockSearch),
}));

vi.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: (ns?: string) => {
    const map: Record<string, string> = {
      'cardDetails.title': 'Card details',
      'cardDetails.close': 'Close',
      'cardDetails.imageAlt': '{name}',
      'cardDetails.id': 'Id',
      'cardDetails.name': 'Name',
      'cardDetails.species': 'Species',
      'cardDetails.gender': 'Gender',
      'cardDetails.status': 'Status',
      'cardDetails.type': 'Type',
      'cardDetails.location': 'Location',
      'cardDetails.created': 'Created',
      'cardDetails.unknown': 'Unknown',
    };
    return (key: string, vars?: Record<string, string>) => {
      const k = ns ? `${ns}.${key}` : key;
      const raw = map[k] ?? k;
      return raw.replace('{name}', vars?.name ?? '');
    };
  },
  useFormatter: () => ({
    dateTime: () => 'Jan 2, 2020',
  }),
}));

vi.mock('@rs-react/components/shared', () => ({
  Button: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  ),
}));

vi.mock('@rs-react/context', async () => {
  const React = await import('react');
  const CardDetailContext = React.createContext<TestCardItem | undefined>(undefined);
  return { CardDetailContext };
});

import { CardDetailContext } from '@rs-react/context';

import { CardDetails } from './card-details';

import type { CardItem } from '@rs-react/interfaces';

const sampleCard: TestCardItem = {
  id: 1,
  name: 'Rick Sanchez',
  species: 'Human',
  gender: 'Male',
  status: 'Alive',
  type: '',
  location: { name: 'Earth' },
  image: 'https://example.com/rick.png',
  created: '2020-01-02T00:00:00.000Z',
};

describe('CardDetails', () => {
  beforeEach(() => {
    push.mockClear();
    mockPathname = '/cards';
    mockSearch = 'id=1&search=rick&page=2';
  });

  it('should render localized labels, values and formatted date', () => {
    render(
      <CardDetailContext.Provider value={sampleCard as CardItem}>
        <CardDetails />
      </CardDetailContext.Provider>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText(/Id:/)).toHaveTextContent('Id: 1');
    expect(screen.getByText(/Name:/)).toHaveTextContent('Name: Rick Sanchez');
    expect(screen.getByText(/Species:/)).toHaveTextContent('Species: Human');
    expect(screen.getByText(/Gender:/)).toHaveTextContent('Gender: Male');
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Alive');
    expect(screen.getByText(/Type:/)).toHaveTextContent('Type: Unknown');
    expect(screen.getByText(/Location:/)).toHaveTextContent('Location: Earth');
    expect(screen.getByText(/Created:/)).toHaveTextContent('Created: Jan 2, 2020');
  });

  it('should remove id from query and push on Close', async () => {
    render(
      <CardDetailContext.Provider value={sampleCard as CardItem}>
        <CardDetails />
      </CardDetailContext.Provider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(push).toHaveBeenCalledWith('/cards?search=rick&page=2', { scroll: false });
  });

  it('should not render when context is empty', () => {
    render(<CardDetails />);
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });
});
