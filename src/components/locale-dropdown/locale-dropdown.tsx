'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import React from 'react';
import './locale-dropdown.css';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
];

export function LocaleDropdown() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const changeLocale = (newLocale: string) => {
    setOpen(false);

    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    router.push(newPath);
  };

  const current = LOCALES.find((l) => l.code === locale);

  return (
    <div className="locale-dropdown">
      <button
        type="button"
        className="locale-dropdown-button"
        onClick={() => setOpen(!open)}
      >
        {current?.label ?? locale.toUpperCase()} ▾
      </button>

      {open && (
        <ul className="locale-dropdown-menu">
          {LOCALES.map((l) => (
            <li key={l.code}>
              <button
                onClick={() => changeLocale(l.code)}
                className={l.code === locale ? 'active' : ''}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
