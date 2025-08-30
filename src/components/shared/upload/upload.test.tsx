import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Upload } from './upload';

vi.mock('@rs-react/components', () => ({
  Button: (p: {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    text: string;
    disabled?: boolean;
  }) => (
    <button type="button" disabled={p.disabled} onClick={p.onClick}>
      {p.text}
    </button>
  ),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    if (key === 'browse') return 'Browse…';
    if (key === 'onlyPngJpeg') return 'Only PNG or JPEG files are allowed';
    if (key === 'tooLarge') return 'File too large';
    return key;
  },
}));

class FileReaderMock {
  result: string | ArrayBuffer | null = null;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
  readAsDataURL(file: Blob): void {
    void file;
    this.result = 'data:image/png;base64,QUJD';
    const ev = new ProgressEvent('load') as unknown as ProgressEvent<FileReader>;
    this.onload?.call(this as unknown as FileReader, ev);
  }
}
const RealFileReader = globalThis.FileReader;

beforeEach(() => {
  (globalThis as unknown as { FileReader: new () => FileReader }).FileReader =
    FileReaderMock as unknown as new () => FileReader;
});

afterEach(() => {
  (globalThis as unknown as { FileReader: new () => FileReader }).FileReader =
    RealFileReader as unknown as new () => FileReader;
  vi.restoreAllMocks();
});

function makeFile(content: string, name: string, type: string) {
  return new File([content], name, { type });
}

describe('Upload', () => {
  it('should render with label and associate htmlFor', () => {
    render(<Upload id="u1" name="photo" label="Avatar" />);
    const label = screen.getByText('Avatar');
    const input = screen.getByLabelText('Avatar');
    expect(label).toHaveAttribute('for', 'u1');
    expect(input).toHaveAttribute('id', 'u1');
  });

  it('should set default accept to PNG and JPEG', () => {
    const { container } = render(<Upload id="u" name="n" />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.accept).toBe('image/png,image/jpeg');
  });

  it('should set custom accept when provided', () => {
    const { container } = render(<Upload id="u" name="n" accept={['application/pdf']} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.accept).toBe('application/pdf');
  });

  it('should set required and disabled attributes', () => {
    const { container } = render(<Upload id="u" name="n" required disabled />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it('should trigger input.click when pressing Browse…', async () => {
    const user = userEvent.setup();
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');
    render(<Upload id="u" name="n" />);
    await user.click(screen.getByRole('button', { name: 'Browse…' }));
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('should show selected file name after choosing a file', async () => {
    const user = userEvent.setup();
    const { container } = render(<Upload id="u" name="n" />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile('abc', 'pic.png', 'image/png');
    await user.upload(input, file);
    expect(screen.getByText('pic.png')).toBeInTheDocument();
  });

  it('should call onValidFile with base64 when file is valid', async () => {
    const user = userEvent.setup();
    const onValidFile = vi.fn();
    const { container } = render(<Upload id="u" name="n" onValidFile={onValidFile} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile('abc', 'pic.png', 'image/png');
    await user.upload(input, file);
    expect(onValidFile).toHaveBeenCalledTimes(1);
    const arg = onValidFile.mock.calls[0][0];
    expect(arg.file.name).toBe('pic.png');
    expect(arg.base64).toBe('QUJD');
  });

  it('should call onError when file size exceeds maxSize', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    const { container } = render(<Upload id="u" name="n" onError={onError} maxSize={1} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile('abc', 'big.png', 'image/png');
    await user.upload(input, file);
    expect(onError).toHaveBeenCalledWith('File too large');
    expect(screen.getByText(/File too large/i)).toBeInTheDocument();
  });

  it('should prioritize error display over hint', () => {
    render(<Upload id="u" name="n" error="External error" hint="Helpful hint" />);
    expect(screen.getByText('External error')).toBeInTheDocument();
    expect(screen.queryByText('Helpful hint')).toBeNull();
  });

  it('should render hint when there is no error', () => {
    render(<Upload id="u" name="n" hint="Helpful hint" />);
    expect(screen.getByText('Helpful hint')).toBeInTheDocument();
  });

  it('should disable Browse… button when disabled', () => {
    render(<Upload id="u" name="n" disabled />);
    expect(screen.getByRole('button', { name: 'Browse…' })).toBeDisabled();
  });

  it('should merge custom className with base class', () => {
    const { container } = render(<Upload id="u" name="n" className="extra" />);
    expect(container.firstChild).toHaveClass('upload');
    expect(container.firstChild).toHaveClass('extra');
  });
});
