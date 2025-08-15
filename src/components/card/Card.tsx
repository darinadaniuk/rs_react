import Image from 'next/image';

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
      <Image src={cardLogo} alt="logo" width={200} height={320} unoptimized />
      <Image
        src={card.image}
        alt={card.name}
        width={200}
        height={320}
        data-testid="character-img"
        className="card-image"
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
