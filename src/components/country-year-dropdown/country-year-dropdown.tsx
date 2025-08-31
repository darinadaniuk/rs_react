'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import './country-year-dropdown.css';

export function YearDropdown({
  years,
  value,
  onChangeAction,
}: {
  years: number[];
  value: number;
  onChangeAction: (year: number) => void;
}) {
  const t = useTranslations('countries');

  return (
    <div className="year-dropdown">
      <label className="year-dropdown-label" htmlFor="year-select">
        {t('year')}
      </label>
      <select
        id="year-select"
        className="year-dropdown-select"
        value={value}
        onChange={(e) => onChangeAction(Number(e.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
