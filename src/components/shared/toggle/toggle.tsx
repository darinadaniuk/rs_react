import { FaSun, FaMoon } from 'react-icons/fa';

import './toggle.css';

interface ToggleProps {
  checked: boolean;
  label?: string;

  onChange: (checked: boolean) => void;
}

export function Toggle({ checked, label, onChange }: ToggleProps) {
  return (
    <label className="toggle">
      {label && <span className="toggle-label">{label}</span>}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-slider">
        <span className="toggle-thumb">
          {checked ? (
            <FaMoon className="toggle-icon" data-testid="moon-icon" />
          ) : (
            <FaSun className="toggle-icon" data-testid="sun-icon" />
          )}
        </span>
      </span>
    </label>
  );
}
