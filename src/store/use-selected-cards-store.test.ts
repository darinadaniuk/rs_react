import { act } from 'react-dom/test-utils';

import { useSelectedItemsStore } from './use-selected-cards-store';

import type { CardItem } from '@rs-react/interfaces';

describe('useSelectedItemsStore', () => {
  beforeEach(() => {
    act(() => {
      useSelectedItemsStore.getState().unselectAll();
    });
  });

  it('should select a card', () => {
    const card = { id: 1, name: 'Card 1' } as const;

    act(() => {
      useSelectedItemsStore.getState().selectItem(card as CardItem);
    });

    const selected = useSelectedItemsStore.getState().selectedCards;
    expect(selected).toContainEqual(card);
  });

  it('should unselect a card by id', () => {
    const card1 = { id: 1, name: 'Card 1' } as const;
    const card2 = { id: 2, name: 'Card 2' } as const;

    act(() => {
      useSelectedItemsStore.getState().selectItem(card1 as CardItem);
      useSelectedItemsStore.getState().selectItem(card2 as CardItem);
    });

    act(() => {
      useSelectedItemsStore.getState().unselectItem(1);
    });

    const selected = useSelectedItemsStore.getState().selectedCards;
    expect(selected).not.toContainEqual(card1);
    expect(selected).toContainEqual(card2);
  });

  it('should unselect all cards', () => {
    const card1 = { id: 1, name: 'Card 1' } as const;

    act(() => {
      useSelectedItemsStore.getState().selectItem(card1 as CardItem);
    });

    act(() => {
      useSelectedItemsStore.getState().unselectAll();
    });

    const selected = useSelectedItemsStore.getState().selectedCards;
    expect(selected).toHaveLength(0);
  });

  it('should correctly check if a card is selected', () => {
    const card = { id: 1, name: 'Card 1' } as const;

    act(() => {
      useSelectedItemsStore.getState().selectItem(card as CardItem);
    });

    expect(useSelectedItemsStore.getState().isSelected(1)).toBe(true);
    expect(useSelectedItemsStore.getState().isSelected(2)).toBe(false);
  });
});
