'use client';

import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';

import { Button } from '@rs-react/components';
import { NA_TEXT, REQUIRED_COLS, type CountryData } from '@rs-react/constants';

import './country-card.css';

export function CountryCard({
  country,
  extraColumns,
  selectedYear,
}: {
  country: CountryData;
  extraColumns: string[];
  selectedYear?: number;
}) {
  const t = useTranslations('countryCard');

  const [open, setOpen] = useState(false);
  const rows = useMemo(
    () => [...country.rows].sort((a, b) => (a.year ?? 0) - (b.year ?? 0)),
    [country.rows],
  );
  const formatNum = new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 });

  const selected = useMemo(
    () => rows.find((row) => row.year === selectedYear),
    [rows, selectedYear],
  );

  const headerPopulation =
    typeof selected?.population === 'number'
      ? formatNum.format(selected.population)
      : country?.latestPopulation
        ? formatNum.format(country.latestPopulation)
        : NA_TEXT;

  const iso = country.isoCode ?? NA_TEXT;

  return (
    <div className="country-card">
      <div className="country-card-header">
        <div className="card-header-texts ">
          <div className="country-name">{country.name}</div>
          {selectedYear && (
            <div className="country-text">
              {t('year')}: {selectedYear}
            </div>
          )}
          <div className="country-text">
            {t('population')}: {headerPopulation}
          </div>
          <div className="country-text">
            {t('iso')}: {iso}
          </div>
        </div>
        <Button onClick={() => setOpen((v) => !v)} text={open ? t('hide') : t('show')} />
      </div>
      {open && (
        <div className="country-table-wrap">
          <table className="country-table">
            <thead>
              <tr>
                {REQUIRED_COLS.map((col) => (
                  <th key={col} className="th">
                    {col.replaceAll('_', ' ')}
                  </th>
                ))}
                {extraColumns.map((col) => (
                  <th key={col} className="th">
                    {col.replaceAll('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isActive = row.year === selectedYear;

                return (
                  <tr key={row.year} className={`tr${isActive ? ' is-active' : ''}`}>
                    <td className="td">{row.year}</td>
                    <td className="td">
                      {row.population ? formatNum.format(row.population) : NA_TEXT}
                    </td>
                    <td className="td">{row.co2 ? formatNum.format(row.co2) : NA_TEXT}</td>
                    <td className="td">
                      {row.co2_per_capita ? formatNum.format(row.co2_per_capita) : NA_TEXT}
                    </td>
                    {extraColumns.map((k) => (
                      <td key={k} className="td">
                        {row[k] ? formatNum.format(Number(row[k])) : NA_TEXT}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
