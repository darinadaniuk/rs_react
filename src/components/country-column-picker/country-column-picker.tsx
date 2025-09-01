'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { Dialog, Checkbox } from '@rs-react/components/shared';
import './country-column-picker.css';

export function ColumnPickerModal({
  open,
  onCloseAction,
  availableFields,
  selected,
  onToggleAction,
}: {
  open: boolean;
  availableFields: string[];
  selected: string[];
  onCloseAction: () => void;
  onToggleAction: (field: string, on: boolean) => void;
}) {
  const t = useTranslations('columnPicker');

  return (
    <Dialog isOpen={open} onClose={onCloseAction} title={t('title')} withSubmit={false}>
      <div className="country-picker-body">
        <p className="country-picker-text">{t('intro')}</p>
        <p className="country-picker-text">
          {t('requiredPrefix')} <b>{t('columns.year')}</b>, <b>{t('columns.population')}</b>,{' '}
          <b>{t('columns.co2')}</b>, <b>{t('columns.co2_per_capita')}</b>.
        </p>
        {availableFields.length === 0 ? (
          <div>{t('noFields')}</div>
        ) : (
          <div className="country-picker-grid">
            {availableFields.map((field) => {
              const checked = selected.includes(field);
              return (
                <div key={field} className="country-picker-item">
                  <Checkbox checked={checked} onChange={(state) => onToggleAction(field, state)} />
                  <span className="picker-item-text">{field.replaceAll('_', ' ')}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Dialog>
  );
}
