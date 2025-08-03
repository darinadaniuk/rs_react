import cardLogo from '@rs-react/assets/rick-and-morty.png';
import { Checkbox } from '@rs-react/components';
import { useSelectedItemsStore } from '@rs-react/store';

import type { CardItem } from '@rs-react/interfaces';

import './card.css';

interface CardProps {
  card: CardItem;
  isActive?: boolean;
  onCardClick?: (cardId: number) => void;
}

export function Card({ card, isActive, onCardClick }: CardProps) {
  /**
   * Question to a mentor / reviewer:
   * is it ok to use a store in a dumb component?
   * in my case, should I emit data to the Cards (container) component?
   */
  const selectCard = useSelectedItemsStore((state) => state.selectItem);
  const unSelectCard = useSelectedItemsStore((state) => state.unselectItem);
  const isChecked = useSelectedItemsStore((state) => state.isSelected(card.id));
  const setCheckboxState = () =>
    isChecked ? unSelectCard(card.id) : selectCard(card);

  return (
    <div
      role="button"
      className={`card ${isActive ? 'active' : ''}`}
      onClick={() => onCardClick?.(card.id)}
    >
      <img className="card-logo" src={cardLogo} alt="logo" />
      <img
        data-testid="character-img"
        className="card-image"
        src={card.image}
        alt={card.name}
      />
      <div className="card-footer">
        <div>
          <h3 className="card-name">{card.name}</h3>
          <p className="card-description">{card.species}</p>
        </div>
        <Checkbox checked={isChecked} onChange={setCheckboxState} />
      </div>
    </div>
  );
}
