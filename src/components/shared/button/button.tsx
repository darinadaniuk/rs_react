import './button.css';

interface ButtonProps {
  text?: string;
  type?: 'danger' | 'primary';
  disabled?: boolean;

  onClick: () => void;
}

export function Button({
  text = 'Click me',
  type = 'primary',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button className={`button ${type}`} disabled={disabled} onClick={onClick}>
      {text}
    </button>
  );
}
