import { Button } from '@rs-react/components';

interface CSVExportProps<T extends Record<string, unknown>> {
  data: T[];
  filename: string;
  buttonText?: string;
}

function convertToCSV<T extends Record<string, unknown>>(items: T[]): string {
  const tableHeaders = Object.keys(items[0]);
  const tableRows = items.map((item) =>
    tableHeaders.map((key) => JSON.stringify(item[key] ?? '')).join(','),
  );

  return [tableHeaders.join(','), ...tableRows].join('\n');
}

export function CSVExport<T extends Record<string, unknown>>({
  data,
  filename,
  buttonText = 'Download',
}: CSVExportProps<T>) {
  const isDownloadDisabled = !data?.length;

  const download = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    a.click();

    URL.revokeObjectURL(url);
  };

  return <Button onClick={download} text={buttonText} disabled={isDownloadDisabled} />;
}
