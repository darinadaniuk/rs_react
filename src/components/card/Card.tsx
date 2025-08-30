import Image from 'next/image';
import React from 'react';

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
  const selectCard = useSelectedItemsStore((s) => s.selectItem);
  const unSelectCard = useSelectedItemsStore((s) => s.unselectItem);
  const isChecked = useSelectedItemsStore((s) => s.isSelected(card.id));

  const setCheckboxState = () => (isChecked ? unSelectCard(card.id) : selectCard(card));

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-stop-card-click]')) return;
    onCardClick?.(card.id);
  };

  return (
    <div role="button" className={`card ${isActive ? 'active' : ''}`} onClick={handleCardClick}>
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

        <div data-stop-card-click onClick={stop}>
          <Checkbox checked={isChecked} onChange={setCheckboxState} />
        </div>
      </div>
    </div>
  );
}
