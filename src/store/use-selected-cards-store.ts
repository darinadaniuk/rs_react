import { create } from 'zustand';

import type { CardItem } from '@rs-react/interfaces';

type SelectedItemsAction = {
  selectItem: (card: CardItem) => void;
  unselectItem: (id: number) => void;
  isSelected: (id: number) => boolean;
  unselectAll: () => void;
};

interface SelectedItemsState {
  selectedCards: CardItem[];
}

export const useSelectedItemsStore = create<
  SelectedItemsState & SelectedItemsAction
>((set, get) => ({
  selectedCards: [],

  selectItem: (card) =>
    set((state) => ({ selectedCards: [...state.selectedCards, card] })),
  unselectItem: (id) =>
    set((state) => ({
      selectedCards: [...state.selectedCards].filter((card) => card.id !== id),
    })),
  unselectAll: () => set(() => ({ selectedCards: [] })),
  isSelected: (id) => !!get().selectedCards.find((card) => card.id === id),
}));
