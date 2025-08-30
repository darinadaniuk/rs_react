import { create } from 'zustand';

type CountryState = {
  countries: string[];
  setCountries: (list: string[]) => void;
};

const COUNTRIES = [
  'Canada',
  'United States',
  'United Kingdom',
  'France',
  'Germany',
  'Spain',
  'Italy',
  'Ukraine',
  'Poland',
  'Sweden',
  'Norway',
  'Denmark',
  'China',
  'Japan',
  'South Korea',
  'India',
  'Israel',
  'Turkey',
];

export const useCountryStore = create<CountryState>((set) => ({
  countries: COUNTRIES,
  setCountries: (list) => set({ countries: list }),
}));
