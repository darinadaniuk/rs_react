import './button.css';

interface ButtonProps {
  text?: string;
  type?: 'danger' | 'primary';

  onClick: () => void;
}

export function Button({
  text = 'Click me',
  type = 'primary',
  onClick,
}: ButtonProps) {
  return (
    <button className={`button ${type}`} onClick={onClick}>
      {text}
    </button>
  );
}
