'use client';

import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import { Button } from '@rs-react/components';

import './upload.css';

export type UploadInfo = {
  file: File;
  base64: string;
};

type UploadProps = {
  id: string;
  name: string;
  label?: React.ReactNode;
  accept?: string[];
  maxSize?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hint?: React.ReactNode;
  error?: string;
  onError?: (message?: string) => void;
  onValidFile?: (info: UploadInfo) => void;
};

const DEFAULT_ALLOWED_MIME = ['image/png', 'image/jpeg'];
const DEFAULT_MAX_SIZE = 2 * 1024 * 1024;

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const s = String(reader.result ?? '');
      const i = s.indexOf(',');
      resolve(i >= 0 ? s.slice(i + 1) : s);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const Upload: React.FC<UploadProps> = ({
  id,
  name,
  label,
  accept,
  maxSize = DEFAULT_MAX_SIZE,
  required = false,
  disabled = false,
  className,
  hint,
  error,
  onError,
  onValidFile,
}) => {
  const t = useTranslations('upload');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localError, setLocalError] = useState<string | undefined>();
  const [selectedName, setSelectedName] = useState<string>('');

  const allowedMime = accept && accept.length ? accept : DEFAULT_ALLOWED_MIME;
  const acceptAttr = allowedMime.join(',');

  function setError(msg?: string) {
    setLocalError(msg);
    onError?.(msg);
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedName(file.name);

    if (!allowedMime.includes(file.type)) {
      setError(t('onlyPngJpeg'));
      return;
    }
    if (file.size > maxSize) {
      setError(t('tooLarge', { maxMB: Math.round(maxSize / (1024 * 1024)) }));
      return;
    }

    setError(undefined);
    const base64 = await toBase64(file);
    onValidFile?.({ file, base64 });
  }

  return (
    <div className={classNames('upload', className, { disabled })}>
      {label && (
        <label className="upload-label" htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        name={name}
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        required={required}
        disabled={disabled}
        className="upload-input"
        onChange={handleChange}
      />

      <div className="upload-actions">
        <Button
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
          text={t('browse')}
          disabled={disabled}
        />
        {selectedName && <span className="upload-file-name">{selectedName}</span>}
      </div>

      {(error ?? localError) && <div className="upload-error-text">{error ?? localError}</div>}
      {!error && !localError && hint && <p className="upload-hint">{hint}</p>}
    </div>
  );
};
