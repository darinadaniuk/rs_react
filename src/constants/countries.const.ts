export type YearRow = {
  year: number;
  population?: number | null;
  co2?: number | null;
  co2_per_capita?: number | null;
  iso_code?: string | null;
  [key: string]: number | string | null | undefined;
};

export interface CountryData {
  name: string;
  isoCode?: string;
  latestPopulation?: number;
  rows: YearRow[];
}

export interface DataResult {
  countries: CountryData[];
  availableFields: string[];
}

export const REQUIRED_COLS = ['year', 'population', 'co2', 'co2_per_capita'] as const;

export const NA_TEXT = 'N/A';
