import classNames from 'classnames';
import React from 'react';
import './checkbox.css';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  name,
  value = 'on',
  required = false,
  className,
}) => {
  const wrapperClass = classNames('custom-checkbox', className, {
    checked,
    disabled,
  });

  return (
    <label className={wrapperClass}>
      <input
        name={name}
        type="checkbox"
        className="custom-checkbox-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        required={required}
        value={value}
      />
      <span className="custom-checkbox-box" />
      {label && <span className="custom-checkbox-label">{label}</span>}
    </label>
  );
};
