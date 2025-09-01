import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { ColumnPickerModal } from './country-column-picker';

vi.mock('next-intl', () => {
  type Messages = Record<string, string>;

  const MESSAGES: Messages = {
    'columnPicker.title': 'Additional columns',
    'columnPicker.intro': 'Select more columns.',
    'columnPicker.requiredPrefix': 'Required columns are always visible:',
    'columnPicker.noFields': 'No fields',
    'columnPicker.columns.year': 'year',
    'columnPicker.columns.population': 'population',
    'columnPicker.columns.co2': 'CO₂',
    'columnPicker.columns.co2_per_capita': 'CO₂ per capita',
  };

  const useTranslations = (ns?: string) => {
    return (key: string): string => {
      const fullKey = ns ? `${ns}.${key}` : key;
      return MESSAGES[fullKey] ?? fullKey;
    };
  };

  return { __esModule: true, useTranslations };
});

vi.mock('@rs-react/components/shared', () => {
  interface DialogProps {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    children?: React.ReactNode;
  }
  const Dialog: React.FC<DialogProps> = ({ isOpen, title, onClose, children }) =>
    isOpen ? (
      <div>
        {title ? <h2>{title}</h2> : null}
        <button aria-label="close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    ) : null;

  interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }
  const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => (
    <input
      type="checkbox"
      role="checkbox"
      aria-label="field-checkbox"
      checked={checked}
      onChange={(e) => onChange(e.currentTarget.checked)}
    />
  );

  return { __esModule: true, Dialog, Checkbox };
});

describe('ColumnPickerModal', () => {
  it('should render fields and toggle a checkbox', () => {
    const onToggleAction = vi.fn();

    render(
      <ColumnPickerModal
        open
        onCloseAction={vi.fn()}
        availableFields={['methane', 'oil_co2']}
        selected={['methane']}
        onToggleAction={onToggleAction}
      />,
    );

    expect(screen.getByText('Additional columns')).toBeInTheDocument();
    expect(screen.getByText('methane')).toBeInTheDocument();
    expect(screen.getByText('oil co2')).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    expect(onToggleAction).toHaveBeenCalledTimes(1);
    expect(onToggleAction).toHaveBeenCalledWith('oil_co2', true);
  });

  it('should show the empty state when there are no fields', () => {
    render(
      <ColumnPickerModal
        open
        onCloseAction={vi.fn()}
        availableFields={[]}
        selected={[]}
        onToggleAction={vi.fn()}
      />,
    );
    expect(screen.getByText('No fields')).toBeInTheDocument();
  });

  it('should call onCloseAction when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ColumnPickerModal
        open
        onCloseAction={onClose}
        availableFields={[]}
        selected={[]}
        onToggleAction={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByLabelText('close'));
    expect(onClose).toHaveBeenCalled();
  });
});
