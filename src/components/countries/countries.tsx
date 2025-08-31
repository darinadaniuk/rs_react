'use client';

import { useTranslations } from 'next-intl';
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import {
  Button,
  Search,
  Spinner,
  CountryCard,
  ColumnPickerModal,
  YearDropdown,
} from '@rs-react/components';

import { createDataResource } from './data/resource';

import type { DataResult } from '@rs-react/constants';

import './countries.css';

function CountriesContent({ resource }: { resource: { read: () => DataResult } }) {
  const t = useTranslations('countries');

  const { countries, availableFields } = resource.read();

  const [extraCols, setExtraCols] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('co2-extra-cols');
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? (arr as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('co2-extra-cols', JSON.stringify(extraCols));
    } catch {
      console.error('Failed to save');
    }
  }, [extraCols]);

  const years = useMemo(
    () => [...new Set(countries.flatMap((c) => c.rows.map((r) => r.year)))].sort((a, b) => b - a),
    [countries],
  );

  const defaultYear = years[0] ?? new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const onPickYear = useCallback((year: number) => setSelectedYear(year), []);

  const [sortBy, setSortBy] = useState<'name' | 'population'>('name');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

  const [showModal, setShowModal] = useState(false);
  const onOpenModal = useCallback(() => setShowModal(true), []);
  const onCloseModal = useCallback(() => setShowModal(false), []);

  const [query, setQuery] = useState('');
  const onSearch = useCallback((value: string) => setQuery(value), []);

  const onChangeSortBy = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'name' | 'population'),
    [],
  );
  const onChangeDirection = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setDirection(e.target.value as 'asc' | 'desc'),
    [],
  );

  const onToggleColumns = useCallback(
    (field: string, on: boolean) =>
      setExtraCols((prev) =>
        on
          ? prev.includes(field)
            ? prev
            : [...prev, field]
          : prev.filter((item) => item !== field),
      ),
    [],
  );

  const filtered = useMemo(() => {
    const _query = query.trim().toLowerCase();
    if (!_query) return countries;
    return countries.filter((country) => country.name.toLowerCase().includes(_query));
  }, [countries, query]);

  const sorted = useMemo(() => {
    const _direction = direction === 'asc' ? 1 : -1;
    const list = [...filtered];

    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name) * _direction);
      return list;
    }

    const population = (country: (typeof countries)[number]) => {
      const row = country.rows.find((row) => row.year === selectedYear);
      return row?.population ?? country.latestPopulation ?? null;
    };

    list.sort((leftCountry, rightCountry) => {
      const leftPopulation = population(leftCountry);
      const rightPopulation = population(rightCountry);

      if (leftPopulation == null || rightPopulation == null) {
        if (leftPopulation == null && rightPopulation == null) {
          return leftCountry.name.localeCompare(rightCountry.name) * _direction;
        }
        return leftPopulation == null ? 1 : -1;
      }

      const populationDelta = leftPopulation - rightPopulation;
      return populationDelta !== 0
        ? populationDelta * _direction
        : leftCountry.name.localeCompare(rightCountry.name) * _direction;
    });

    return list;
  }, [filtered, sortBy, direction, selectedYear]);

  return (
    <div className="countries-container">
      <div className="countries-header">
        <Button onClick={onOpenModal} text={t('chooseColumns')} />
        <div className="countries-controls">
          <YearDropdown years={years} value={selectedYear} onChangeAction={onPickYear} />

          <div className="countries-sort">
            <label htmlFor="sortBy">{t('sortBy')} </label>
            <select
              id="sortBy"
              className="dropdown-select"
              value={sortBy}
              onChange={onChangeSortBy}
            >
              <option value="name">{t('name')}</option>
              <option value="population">{t('population')}</option>
            </select>
          </div>
          <div className="countries-sort">
            <label htmlFor="direction">{t('direction')} </label>
            <select
              id="direction"
              className="dropdown-select"
              value={direction}
              onChange={onChangeDirection}
            >
              <option value="asc">{t('asc')}</option>
              <option value="desc">{t('desc')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="countries-search">
        <Search search={onSearch} placeholder={t('filterPlaceholder')} />
      </div>

      <div className="countries-grid">
        {sorted.map((country) => (
          <CountryCard
            key={country.name}
            country={country}
            extraColumns={extraCols}
            selectedYear={selectedYear}
          />
        ))}
      </div>

      <ColumnPickerModal
        open={showModal}
        onCloseAction={onCloseModal}
        availableFields={availableFields}
        selected={extraCols}
        onToggleAction={onToggleColumns}
      />
    </div>
  );
}

export default function Countries({ dataUrl }: { dataUrl: string }) {
  const resource = useMemo(() => createDataResource(dataUrl), [dataUrl]);

  return (
    <Suspense
      fallback={
        <div className="countries-fallback">
          <Spinner />
        </div>
      }
    >
      <CountriesContent resource={resource} />
    </Suspense>
  );
}
