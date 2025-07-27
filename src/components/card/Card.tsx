import cardLogo from '@rs-react/assets/rick-and-morty.png';

import type { CardItem } from '@rs-react/interfaces';

import './card.css';

interface CardProps {
  card: CardItem;
  isActive?: boolean;
  onCardClick?: (cardId: number) => void;
}

export function Card({ card, isActive, onCardClick }: CardProps) {
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
      <h3 className="card-name">{card.name}</h3>
      <p className="card-description">{card.species}</p>
    </div>
  );
}
