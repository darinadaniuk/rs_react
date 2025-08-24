'use client';

import { useTranslations } from 'next-intl';
import React, { useCallback, useMemo, useState } from 'react';
import { FaCog, FaUser } from 'react-icons/fa';

import './header.css';

import { Navigation, Toggle, LocaleDropdown } from '@rs-react/components/client';
import { useTheme } from '@rs-react/context';
import { useUserStore } from '@rs-react/store';

import ProfileDialog from '../profile-dialog/profile-dialog';

export function Header() {
  const t = useTranslations('header');
  const { theme, setTheme } = useTheme();

  const profile = useUserStore((store) => store.data);
  const hasProfile = useMemo(() => !!Object.keys(profile ?? {}).length, [profile]);

  const [open, setOpen] = useState(false);

  const openIfHasProfile = useCallback(() => {
    if (hasProfile) setOpen(true);
  }, [hasProfile]);

  const onKey = useCallback<React.KeyboardEventHandler<SVGElement>>(
    (e) => {
      if (!hasProfile) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
    },
    [hasProfile],
  );

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
        <FaCog
          aria-label={t('settingsIconAria')}
          title={t('settingsIconAria')}
          className={`settings-icon ${hasProfile ? 'with-profile' : ''}`}
          role="button"
          tabIndex={0}
          onClick={openIfHasProfile}
          onKeyDown={onKey}
        />
        <Toggle
          checked={theme === 'dark'}
          onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
        <LocaleDropdown />
      </div>

      <ProfileDialog isOpen={open} onCloseAction={() => setOpen(false)} />
    </header>
  );
}
