import classNames from 'classnames';
import React from 'react';

import './radio.css';

interface CustomRadioProps {
  checked: boolean;
  label?: string;
  disabled?: boolean;

  name?: string;
  value: string;
  required?: boolean;
  className?: string;
  
  onChange: (value: string) => void;
}

export const Radio: React.FC<CustomRadioProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  name,
  value,
  required = false,
  className,
}) => {
  const wrapperClass = classNames('custom-radio', className, {
    checked,
    disabled,
  });

  return (
    <label className={wrapperClass}>
      <input
        name={name}
        type="radio"
        className="custom-radio-input"
        checked={checked}
        onChange={(e) => {
          if (e.target.checked) onChange(e.target.value);
        }}
        disabled={disabled}
        required={required}
        value={value}
      />
      <span className="custom-radio-box" />
      { label && <span className="custom-radio-label">{ label }</span>}
    </label>
  );
};
