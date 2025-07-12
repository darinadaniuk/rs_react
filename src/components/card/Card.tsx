import type { CardItem } from '../../interfaces/Cards';
import './Card.css';
import cardLogo from '../../assets/Rick_and_Morty.png';

interface CardProps {
  card: CardItem;
}

function Card({ card }: CardProps) {
  return (
    <div className="card">
      <img className="card-logo" src={cardLogo} alt="logo" />
      <img className="card-image" src={card.image} alt={card.name} />
      <h3 className="card-name">{card.name}</h3>
      <p className="card-description">{card.species}</p>
    </div>
  );
}

export default Card;
