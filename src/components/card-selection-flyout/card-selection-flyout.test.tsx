import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { CardSelectionFlyout } from './card-selection-flyout';

type ButtonProps = {
  onClick: () => void;
  text: string;
};

type CSVExportProps = {
  data: Record<string, unknown>[];
  filename: string;
};

vi.mock('@rs-react/components', () => ({
  Button: ({ onClick, text }: ButtonProps) => <button onClick={onClick}>{text}</button>,
  CSVExport: ({ data, filename }: CSVExportProps) => (
    <div data-testid="csv-export">
      CSVExport filename: {filename} | Data length: {data.length}
    </div>
  ),
  Flyout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

type StoreState = {
  unselectAll: () => void;
};

const mockUnselectAll = vi.fn();
vi.mock('@rs-react/store', () => ({
  useSelectedItemsStore: (selector: (state: StoreState) => unknown) =>
    selector({ unselectAll: mockUnselectAll }),
}));

describe('CardSelectionFlyout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render plural items selected text', () => {
    const cards = [{ id: 1 }, { id: 2 }];
    render(<CardSelectionFlyout cards={cards} />);

    expect(screen.getByText('2 items are selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByTestId('csv-export')).toHaveTextContent('filename: 2_cards.csv');
  });

  it('should render singular item selected text', () => {
    const cards = [{ id: 1 }];
    render(<CardSelectionFlyout cards={cards} />);

    expect(screen.getByText('1 item is selected')).toBeInTheDocument();
    expect(screen.getByTestId('csv-export')).toHaveTextContent('filename: 1_card.csv');
  });

  it('should call unselectAll when "Unselect all" button is clicked', () => {
    const cards = [{ id: 1 }, { id: 2 }];
    render(<CardSelectionFlyout cards={cards} />);

    fireEvent.click(screen.getByText('Unselect all'));
    expect(mockUnselectAll).toHaveBeenCalledTimes(1);
  });
});
