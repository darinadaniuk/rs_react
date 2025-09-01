'use client';

import type { DataResult, CountryData } from '@rs-react/constants';

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

const toRows = (v: unknown): Record<string, unknown>[] => {
  if (Array.isArray(v)) return v.filter(isRecord);
  if (isRecord(v) && Array.isArray(v.data)) return (v.data as unknown[]).filter(isRecord);
  return [];
};

const getYear = (r: Record<string, unknown>): number => (typeof r.year === 'number' ? r.year : 0);

const getIso = (r: Record<string, unknown>): string | undefined => {
  const v = r.iso_code;
  return typeof v === 'string' && v.trim() ? v : undefined;
};

function normalize(text: string): DataResult {
  const rawUnknown = JSON.parse(text) as unknown;
  if (!isRecord(rawUnknown)) return { countries: [], availableFields: [] };

  const raw = rawUnknown as Record<string, unknown>;
  const countries: CountryData[] = [];
  const fields = new Set<string>();

  for (const [key, v] of Object.entries(raw)) {
    const rows0 = toRows(v);
    const isoTop =
      isRecord(v) && typeof v.iso_code === 'string' ? (v.iso_code as string) : undefined;
    const name = isRecord(v) && typeof v.country === 'string' ? (v.country as string) : key;

    const rows = rows0
      .map((r) => ({ ...r, iso_code: getIso(r) ?? isoTop }))
      .sort((a, b) => getYear(a) - getYear(b));

    for (const r of rows) for (const k of Object.keys(r)) fields.add(k);

    const latest = rows.length ? rows[rows.length - 1] : {};
    const latestPopulation =
      isRecord(latest) && typeof latest.population === 'number'
        ? (latest.population as number)
        : undefined;

    let isoCode: string | undefined = isoTop;
    for (let i = rows.length - 1; i >= 0 && !isoCode; i--) {
      const code = getIso(rows[i]);
      if (code) isoCode = code;
    }

    countries.push({
      name,
      isoCode,
      latestPopulation,
      rows: rows as unknown as CountryData['rows'],
    });
  }

  const required = new Set(['year', 'population', 'co2', 'co2_per_capita', 'iso_code']);
  const availableFields = [...fields].filter((k) => !required.has(k)).sort();

  return { countries, availableFields };
}

export function createDataResource(url: string) {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: DataResult | Error;

  const suspender: Promise<DataResult> = (async () => {
    const abs = /^https?:\/\//i.test(url) ? url : new URL(url, location.href).toString();
    const res = await fetch(abs, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${abs}`);
    const text = await res.text();
    const payload = normalize(text);
    status = 'success';
    result = payload;
    return payload;
  })().catch((e: unknown) => {
    status = 'error';
    const err = e instanceof Error ? e : new Error(String(e));
    result = err;
    throw err;
  });

  return {
    read(): DataResult {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      return result as DataResult;
    },
  };
}

export { normalize };
