import './Button.css';

interface ButtonProps {
  text?: string;
  type?: 'danger' | 'primary';

  onClick: () => void;
}

function Button({ text = 'Click me', type = 'primary', onClick }: ButtonProps) {
  return (
    <button className={`button ${type}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
