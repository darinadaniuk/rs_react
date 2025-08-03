import type { ReactNode } from 'react';

import './flyout.css';

interface FlyoutProps {
  children: ReactNode;
}

export function Flyout({ children }: FlyoutProps) {
  return <div className="flyout">{children}</div>;
}
