import { Button, CSVExport, Flyout } from '@rs-react/components';
import { useSelectedItemsStore } from '@rs-react/store';

import './card-selection-flyout.css';

interface CardSelectionFlyoutProps {
  cards: Record<string, unknown>[];
}

export function CardSelectionFlyout({ cards }: CardSelectionFlyoutProps) {
  const unselectAll = useSelectedItemsStore((state) => state.unselectAll);

  return (
    <Flyout>
      <div className="cards-selection">
        <div>
          {cards.length} {cards.length === 1 ? 'item is' : 'items are'} selected
        </div>
        <div className="cards-selection-controls">
          <Button onClick={unselectAll} text="Unselect all" />
          <CSVExport
            data={cards}
            filename={`${cards.length}_${cards.length === 1 ? 'card' : 'cards'}.csv`}
          />
        </div>
      </div>
    </Flyout>
  );
}
