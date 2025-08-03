import classNames from 'classnames';
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
  const checkboxClass = classNames('custom-checkbox', { checked, disabled });

  const toggle = (e: React.MouseEvent | React.KeyboardEvent): void => {
    if (!disabled) {
      e.stopPropagation();
      onChange(!checked);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggle(e);
    }
  };

  return (
    <div
      className={checkboxClass}
      onClick={toggle}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <span className="custom-checkbox-box" />
      {label && <span className="custom-checkbox-label">{label}</span>}
    </div>
  );
};
