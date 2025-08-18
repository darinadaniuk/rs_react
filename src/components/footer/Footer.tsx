'use client';

import './footer.css';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="footer">
      <p>{t('copyright')}</p>
    </footer>
  );
}
