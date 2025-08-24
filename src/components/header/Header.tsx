'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { FaCog, FaUser } from 'react-icons/fa';

import './header.css';

import { Navigation, Toggle, LocaleDropdown } from '@rs-react/components/client';
import { useTheme } from '@rs-react/context';

export function Header() {
  const t = useTranslations('header');
  const { theme, setTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-block">
        <h1 className="header-title" data-testid="header-title">
          {t('title')}
        </h1>
      </div>

      <div className="header-block">
        <Navigation />
      </div>

      <div className="header-block">
        <FaUser aria-label={t('userIconAria')} title={t('userIconAria')} />
        <p data-testid="header-user" className="user-name">
          {t('name')}
        </p>
        <FaCog aria-label={t('settingsIconAria')} title={t('settingsIconAria')} />
        <Toggle
          checked={theme === 'dark'}
          onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
        <LocaleDropdown />
      </div>
    </header>
  );
}
