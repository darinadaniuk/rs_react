import React from 'react';
import './checkbox.css';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  const toggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (!disabled) {
      e.stopPropagation();
      onChange(!checked);
    }
  };

  return (
    <div
      className={`custom-checkbox ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={toggle}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle()}
    >
      <span className="custom-checkbox-box" />
      {label && <span className="custom-checkbox-label">{label}</span>}
    </div>
  );
};
