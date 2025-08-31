import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { CountryCard } from './country-card';

vi.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      population: 'Population',
      iso: 'ISO',
      show: 'Show',
      hide: 'Hide',
    };
    return map[key] ?? key;
  },
}));

vi.mock('@rs-react/components', () => {
  const Button: React.FC<{ text?: string; onClick?: () => void }> = ({ text, onClick }) => (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  );
  return { __esModule: true, Button };
});

vi.mock('@rs-react/constants', () => {
  return {
    __esModule: true,
    NA_TEXT: 'N/A',
    REQUIRED_COLS: ['year', 'population', 'co2', 'co2_per_capita'],
  };
});

type CountryRow = {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  gdp?: number;
};

type Country = {
  name: string;
  isoCode?: string;
  latestPopulation?: number;
  rows: CountryRow[];
};

describe('CountryCard', () => {
  const baseCountry: Country = {
    name: 'Canada',
    isoCode: 'CAN',
    latestPopulation: 38000000,
    rows: [
      { year: 2020, population: 38000000, co2: 12, co2_per_capita: 7, gdp: 1000 },
      { year: 2018, population: 36000000 },
      { year: 2019, population: 37000000, co2: 10, co2_per_capita: 6, gdp: 900 },
    ],
  };

  it('renders header info and toggles table visibility', async () => {
    render(<CountryCard country={baseCountry} extraColumns={['gdp']} />);
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText(/Population:/i)).toBeInTheDocument();
    expect(screen.getByText(/ISO:/i)).toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: 'Show' });
    await userEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows correct headers and sorted rows', async () => {
    render(<CountryCard country={baseCountry} extraColumns={['gdp']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Show' }));

    const table = screen.getByRole('table');
    const headers = within(table)
      .getAllByRole('columnheader')
      .map((th) => th.textContent);
    expect(headers).toEqual(['year', 'population', 'co2', 'co2 per capita', 'gdp']);

    const rows = within(table).getAllByRole('row').slice(1);
    expect(within(rows[0]).getAllByRole('cell')[0]).toHaveTextContent('2018');
    expect(within(rows[1]).getAllByRole('cell')[0]).toHaveTextContent('2019');
    expect(within(rows[2]).getAllByRole('cell')[0]).toHaveTextContent('2020');
  });
});
