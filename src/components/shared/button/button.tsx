import React from 'react';
import './button.css';

interface ButtonProps {
  text?: string;
  type?: 'danger' | 'primary';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Button({
  text = 'Click me',
  type = 'primary',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`button ${type}`}
      disabled={disabled}
      onClick={(e) => onClick?.(e)}
    >
      {text}
    </button>
  );
}
