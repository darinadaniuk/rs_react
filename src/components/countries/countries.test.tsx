import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Countries from './countries';

vi.mock('next-intl', () => {
  type Messages = Record<string, string>;
  const MESSAGES: Messages = {
    'countries.chooseColumns': 'Choose columns',
    'countries.sortBy': 'Sort by',
    'countries.name': 'Name',
    'countries.population': 'Population',
    'countries.direction': 'Direction',
    'countries.asc': 'Ascending',
    'countries.desc': 'Descending',
    'countries.filterPlaceholder': 'Filter countries',
  };

  function useTranslations(ns?: string) {
    return (key: string): string => {
      const fullKey = ns ? `${ns}.${key}` : key;
      return MESSAGES[fullKey] ?? fullKey;
    };
  }

  return { __esModule: true, useTranslations };
});

vi.mock('@rs-react/components', () => {
  type ButtonProps = { onClick?: () => void; text?: string };
  const Button: React.FC<ButtonProps> = ({ onClick, text }) => (
    <button type="button" onClick={onClick}>
      {text ?? 'Button'}
    </button>
  );

  type SearchProps = { search: (value: string) => void; placeholder?: string };
  const Search: React.FC<SearchProps> = ({ search, placeholder }) => (
    <input
      type="text"
      role="textbox"
      placeholder={placeholder}
      onChange={(e) => search(e.currentTarget.value)}
    />
  );

  const Spinner: React.FC = () => <div role="status">loading</div>;

  type CountryCardProps = {
    country: { name: string };
    extraColumns: string[];
    selectedYear: number;
  };
  const CountryCard: React.FC<CountryCardProps> = ({ country }) => (
    <div data-testid="country-card">{country.name}</div>
  );

  type ColumnPickerModalProps = {
    open: boolean;
    onCloseAction: () => void;
    availableFields: string[];
    selected: string[];
    onToggleAction: (field: string, on: boolean) => void;
  };
  const ColumnPickerModal: React.FC<ColumnPickerModalProps> = ({ open, onCloseAction }) =>
    open ? (
      <div role="dialog">
        <div>Column Picker</div>
        <button type="button" onClick={onCloseAction}>
          Close
        </button>
      </div>
    ) : null;

  type YearDropdownProps = {
    years: number[];
    value: number;
    onChangeAction: (year: number) => void;
  };
  const YearDropdown: React.FC<YearDropdownProps> = ({ years, value, onChangeAction }) => (
    <select
      aria-label="year"
      value={value}
      onChange={(e) => onChangeAction(Number(e.currentTarget.value))}
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );

  return {
    __esModule: true,
    Button,
    Search,
    Spinner,
    CountryCard,
    ColumnPickerModal,
    YearDropdown,
  };
});

vi.mock('./data/resource', () => {
  const DATA = {
    countries: [
      {
        name: 'Canada',
        rows: [
          { year: 2020, population: 38000000 },
          { year: 2021, population: 38300000 },
        ],
      },
      { name: 'France', rows: [{ year: 2021, population: 67000000 }] },
    ],
    availableFields: ['co2', 'co2_per_capita'],
  };

  function createDataResource() {
    return { read: () => DATA };
  }

  return { __esModule: true, createDataResource };
});

describe('Countries', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render country cards from resource', () => {
    render(<Countries dataUrl="/test.json" />);
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
  });

  it('should filter countries by search input', () => {
    render(<Countries dataUrl="/test.json" />);
    const input = screen.getByPlaceholderText('Filter countries');
    fireEvent.change(input, { target: { value: 'fra' } });
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.queryByText('Canada')).toBeNull();
  });

  it('should open and close the column picker modal', () => {
    render(<Countries dataUrl="/test.json" />);
    fireEvent.click(screen.getByRole('button', { name: 'Choose columns' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
