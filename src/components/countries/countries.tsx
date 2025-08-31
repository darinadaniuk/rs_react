'use client';

import { useTranslations } from 'next-intl';
import React, { Suspense, useEffect, useMemo, useState } from 'react';

import { Button, Search, Spinner, CountryCard, ColumnPickerModal } from '@rs-react/components';

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

  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const _query = query.trim().toLowerCase();
    if (!_query) return countries;
    return countries.filter((country) => country.name.toLowerCase().includes(_query));
  }, [countries, query]);

  return (
    <div className="countries-container">
      <div className="countries-header">
        <Button onClick={() => setShowModal(true)} text={t('chooseColumns')} />
      </div>

      <div className="countries-search">
        <Search search={setQuery} placeholder={t('filterPlaceholder')} />
      </div>

      <div className="countries-grid">
        {filtered.map((country) => (
          <CountryCard key={country.name} country={country} extraColumns={extraCols} />
        ))}
      </div>

      <ColumnPickerModal
        open={showModal}
        onCloseAction={() => setShowModal(false)}
        availableFields={availableFields}
        selected={extraCols}
        onToggleAction={(field, on) =>
          setExtraCols((prev) => (on ? [...prev, field] : prev.filter((item) => item !== field)))
        }
      />
    </div>
  );
}

export default function CountriesExplorer({ dataUrl }: { dataUrl: string }) {
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
