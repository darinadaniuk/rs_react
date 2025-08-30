'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { Dialog } from '@rs-react/components';
import { useUserStore } from '@rs-react/store';

import './profile-dialog.css';

type ProfileDialogProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  title?: string;
};

const toDataUrl = (value?: string | null) => {
  if (!value) return '';
  if (value.startsWith('data:')) return value;

  const isPng = value.startsWith('iVBORw0K');
  const mime = isPng ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${value}`;
};

export default function ProfileDialog({ isOpen, onCloseAction, title }: ProfileDialogProps) {
  const t = useTranslations('profileDialog');
  const profile = useUserStore((store) => store.data);
  const resetProfile = useUserStore((store) => store.reset);
  const hasProfile = !!profile && Object.keys(profile).length > 0;
  const src = toDataUrl(profile?.pictureBase64 as string | undefined);

  const onResetProfile = () => {
    resetProfile();
    onCloseAction();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onCloseAction}
      title={title}
      withSubmit={false}
      withReset={true}
      onReset={onResetProfile}
    >
      <div className="profile-modal">
        {src && <img src={src} alt={t('pictureAlt')} className="profile-modal-avatar" />}

        {hasProfile ? (
          <dl className="profile-modal-list">
            {profile?.name && (
              <>
                <dt>{t('fields.name')}</dt>
                <dd>{profile.name}</dd>
              </>
            )}
            {typeof profile?.age !== 'undefined' && (
              <>
                <dt>{t('fields.age')}</dt>
                <dd>{profile.age}</dd>
              </>
            )}
            {profile?.email && (
              <>
                <dt>{t('fields.email')}</dt>
                <dd>{profile.email}</dd>
              </>
            )}
            {profile?.gender && (
              <>
                <dt>{t('fields.gender')}</dt>
                <dd>{profile.gender}</dd>
              </>
            )}
            {profile?.country && (
              <>
                <dt>{t('fields.country')}</dt>
                <dd>{profile.country}</dd>
              </>
            )}
          </dl>
        ) : (
          <p className="profile-modal-empty">{t('empty')}</p>
        )}
      </div>
    </Dialog>
  );
}
