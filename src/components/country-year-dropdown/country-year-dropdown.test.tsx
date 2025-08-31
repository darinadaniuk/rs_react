import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { YearDropdown } from './country-year-dropdown';

vi.mock('next-intl', () => {
  type Messages = Record<string, string>;
  const MESSAGES: Messages = { 'countries.year': 'Year' };
  function useTranslations(ns?: string) {
    return (key: string): string => {
      const full = ns ? `${ns}.${key}` : key;
      return MESSAGES[full] ?? full;
    };
  }
  return { __esModule: true, useTranslations };
});

describe('YearDropdown', () => {
  it('should render label from translations and associate it with the select', () => {
    render(<YearDropdown years={[2022, 2023]} value={2023} onChangeAction={vi.fn()} />);
    const select = screen.getByLabelText('Year');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('id', 'year-select');
  });

  it('should render options and reflect the selected value', () => {
    render(<YearDropdown years={[2021, 2022, 2023]} value={2022} onChangeAction={vi.fn()} />);
    const select = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual(['2021', '2022', '2023']);
    expect(select).toHaveValue('2022');
  });

  it('should call onChangeAction with the new year when selection changes', () => {
    const onChangeAction = vi.fn();
    render(<YearDropdown years={[2020, 2021]} value={2020} onChangeAction={onChangeAction} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2021' } });
    expect(onChangeAction).toHaveBeenCalledWith(2021);
  });
});
