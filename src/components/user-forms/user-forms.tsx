'use client';

import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import {
  UserFormRHF,
  UserFormUncontrolled,
  type UncontrolledRegistrationFormHandle,
} from '@rs-react/components';
import { Button, Dialog } from '@rs-react/components/shared';

import './user-forms.css';

export function UserForms() {
  const t = useTranslations('userForm');

  const [openUncontrolled, setOpenUncontrolled] = useState(false);
  const [openRHF, setOpenRHF] = useState(false);

  const uncontrolledRef = useRef<UncontrolledRegistrationFormHandle>(null);

  const [rhfValid, setRhfValid] = useState(false);
  const rhfSubmitRef = useRef<(() => void) | null>(null);

  return (
    <div>
      <div className="user-form-controls">
        <Button onClick={() => setOpenUncontrolled(true)} text={t('buttons.openUncontrolled')} />
        <Button onClick={() => setOpenRHF(true)} text={t('buttons.openRHF')} />
      </div>

      <Dialog
        isOpen={openUncontrolled}
        onClose={() => setOpenUncontrolled(false)}
        onSubmit={() => {
          const valid = uncontrolledRef.current?.submit() ?? false;
          if (valid) setOpenUncontrolled(false);
        }}
        title={t('title')}
      >
        <UserFormUncontrolled ref={uncontrolledRef} />
      </Dialog>

      <Dialog
        isOpen={openRHF}
        onClose={() => {
          setOpenRHF(false);
          setRhfValid(false);
          rhfSubmitRef.current = null;
        }}
        onSubmit={() => rhfSubmitRef.current?.()}
        isSubmitDisabled={!rhfValid}
        title={t('title')}
      >
        <UserFormRHF
          onValidityChangeAction={setRhfValid}
          onSubmitRefAction={(fn) => {
            rhfSubmitRef.current = fn;
          }}
        />
      </Dialog>
    </div>
  );
}
