'use client';

import React, { useRef, useState } from 'react';

import {
  UserFormRHF,
  UserFormUncontrolled,
  type UncontrolledRegistrationFormHandle,
} from '@rs-react/components';
import { Button, Dialog } from '@rs-react/components/shared';

import './user-forms.css';

export function UserForms() {
  const [openUncontrolled, setOpenUncontrolled] = useState(false);
  const [openRHF, setOpenRHF] = useState(false);

  const uncontrolledRef = useRef<UncontrolledRegistrationFormHandle>(null);

  const [rhfValid, setRhfValid] = useState(false);
  const rhfSubmitRef = useRef<(() => void) | null>(null);

  return (
    <div>
      <div className="user-form-controls">
        <Button onClick={() => setOpenUncontrolled(true)} text="Open Uncontrolled Form" />
        <Button onClick={() => setOpenRHF(true)} text="Open React Hook Form" />
      </div>

      <Dialog
        isOpen={openUncontrolled}
        onClose={() => setOpenUncontrolled(false)}
        onSubmit={() => uncontrolledRef.current?.submit()}
        title="Profile"
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
        title="Profile"
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
