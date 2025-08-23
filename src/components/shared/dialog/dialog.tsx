import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@rs-react/components';

import './dialog.css';

export interface DialogProps {
  isOpen: boolean;
  title?: string;
  children?: React.ReactNode;
  isSubmitDisabled?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export function Dialog({
  isOpen,
  title,
  children,
  onClose,
  onSubmit,
  isSubmitDisabled = false,
}: DialogProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const prevFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    prevFocused.current = (document.activeElement as HTMLElement) ?? null;
    return () => {
      prevFocused.current?.focus?.();
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit?.();
  };

  const dialog = (
    <div
      ref={overlayRef}
      className="dialog-overlay"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div ref={dialogRef} tabIndex={-1} className="dialog">
        <div className="dialog-header">
          {title ? <h2 className="dialog-title">{title}</h2> : <span />}
          <button type="button" onClick={onClose} className="dialog-close">×</button>
        </div>

        <div className="dialog-body">{children}</div>

        <div className="dialog-actions">
          <Button text="Close" onClick={onClose} />
          <Button text="Submit" onClick={handleSubmitClick} disabled={isSubmitDisabled} />
        </div>
      </div>
    </div>
  );

  const host = document.getElementById('dialog-root') ?? document.body;
  return createPortal(dialog, host);
}
