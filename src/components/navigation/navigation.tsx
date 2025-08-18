'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { Link } from '@rs-react/i18n/navigation';
import './navigation.css';

export function Navigation() {
  const t = useTranslations('nav');

  return (
    <nav className="navigation">
      <Link className="navigation-link" href="/cards">
        {t('home')}
      </Link>
      <Link className="navigation-link" href="/about">
        {t('about')}
      </Link>
    </nav>
  );
}
