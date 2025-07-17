import cardLogo from '../../assets/rick-and-morty.png';

import type { CardItem } from '../../interfaces/cards';

import './card.css';

interface CardProps {
  card: CardItem;
}

export function Card({ card }: CardProps) {
  return (
    <div className="card">
      <img className="card-logo" src={cardLogo} alt="logo" />
      <img className="card-image" src={card.image} alt={card.name} />
      <h3 className="card-name">{card.name}</h3>
      <p className="card-description">{card.species}</p>
    </div>
  );
}
