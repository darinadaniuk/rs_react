import Countries from '@rs-react/components/countries/countries';

export default function CountriesPage() {
  return (
    <Countries dataUrl="https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json" />
  );
}
