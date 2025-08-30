import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';

import { CSVExport } from './csv-export';

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;
const mockData = [
  { name: 'Rick', species: 'Human' },
  { name: 'Morty', species: 'Human' },
];

describe('<CSVExport />', () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.URL.createObjectURL = originalCreateObjectURL;
    global.URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('should render with default button text', () => {
    render(<CSVExport data={mockData} filename="test.csv" />);
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('should render with custom button text', () => {
    render(<CSVExport data={mockData} filename="test.csv" buttonText="Export CSV" />);
    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
  });

  it('should disable button when data is empty', () => {
    render(<CSVExport data={[]} filename="empty.csv" />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should download CSV on click', () => {
    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    const anchor = originalCreateElement('a');

    anchor.click = clickSpy;

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return anchor;
      }
      return originalCreateElement(tagName);
    });

    render(<CSVExport data={mockData} filename="test.csv" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(anchor.getAttribute('download')).toBe('test.csv');
    expect(clickSpy).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});
